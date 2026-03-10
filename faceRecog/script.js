const video = document.getElementById('video');
const overlay = document.getElementById('overlay');
const statusDiv = document.getElementById('status');
const nameInput = document.getElementById('nameInput');
const registerBtn = document.getElementById('registerBtn');
const recognizeBtn = document.getElementById('recognizeBtn');

let isModelLoaded = false;
let labeledFaceDescriptors = [];

// Load stored faces from local storage
function loadStoredFaces() {
    const stored = localStorage.getItem('labeledFaceDescriptors');
    if (stored) {
        const parsed = JSON.parse(stored);
        // Deserialize Float32Array
        labeledFaceDescriptors = parsed.map(f => {
            return new faceapi.LabeledFaceDescriptors(
                f.label,
                f.descriptors.map(d => new Float32Array(Object.values(d)))
            );
        });
        console.log('Loaded faces:', labeledFaceDescriptors.length);
    }
}

// Save faces to local storage
function saveStoredFaces() {
    // Serialize Float32Array
    const serializable = labeledFaceDescriptors.map(f => ({
        label: f.label,
        descriptors: f.descriptors.map(d => Array.from(d))
    }));
    localStorage.setItem('labeledFaceDescriptors', JSON.stringify(serializable));
}

// Load Models
async function loadModels() {
    statusDiv.innerText = "Loading models...";
    try {
        // Use jsDelivr for better content-type handling than raw.githubusercontent
        const modelUrl = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model';
        await faceapi.nets.ssdMobilenetv1.loadFromUri(modelUrl);
        await faceapi.nets.faceLandmark68Net.loadFromUri(modelUrl);
        await faceapi.nets.faceRecognitionNet.loadFromUri(modelUrl);
        isModelLoaded = true;
        statusDiv.innerText = "Models loaded. Starting video...";
        startVideo();
    } catch (err) {
        console.error(err);
        statusDiv.innerText = "Error loading models. Check console.";
    }
}

function startVideo() {
    navigator.mediaDevices.getUserMedia({ video: {} })
        .then(stream => {
            video.srcObject = stream;
        })
        .catch(err => {
            console.error(err);
            statusDiv.innerText = "Error accessing camera. Allow permissions.";
        });
}

// Register Face
registerBtn.addEventListener('click', async () => {
    if (!isModelLoaded) return;
    const name = nameInput.value.trim();
    if (!name) {
        statusDiv.innerText = "Please enter a name.";
        return;
    }

    statusDiv.innerText = "Detecting face...";
    // ssdMobilenetv1 is the default for detectSingleFace
    const detections = await faceapi.detectSingleFace(video).withFaceLandmarks().withFaceDescriptor();

    if (detections) {
        // Add to descriptors
        const newDescriptor = new faceapi.LabeledFaceDescriptors(name, [detections.descriptor]);
        labeledFaceDescriptors.push(newDescriptor);
        saveStoredFaces();
        statusDiv.innerText = `Registered: ${name}`;
        nameInput.value = '';
    } else {
        statusDiv.innerText = "No face detected. Try again.";
    }
});

let recognitionInterval;

// Recognize Face
recognizeBtn.addEventListener('click', async () => {
    if (!isModelLoaded) return;
    if (labeledFaceDescriptors.length === 0) {
        statusDiv.innerText = "No faces registered yet.";
        return;
    }

    if (recognitionInterval) clearInterval(recognitionInterval);

    statusDiv.innerText = "Recognition started...";

    // Create Face Matcher
    const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6);

    // Initial overlay setup
    const displaySize = { width: video.width, height: video.height };
    faceapi.matchDimensions(overlay, displaySize);

    // Continuous detection loop
    recognitionInterval = setInterval(async () => {
        const detections = await faceapi.detectAllFaces(video).withFaceLandmarks().withFaceDescriptors();
        const resizedDetections = faceapi.resizeResults(detections, displaySize);

        // Clear previous drawing
        const context = overlay.getContext('2d');
        context.clearRect(0, 0, overlay.width, overlay.height);

        const results = resizedDetections.map(d => faceMatcher.findBestMatch(d.descriptor));

        results.forEach((result, i) => {
            const box = resizedDetections[i].detection.box;
            const drawBox = new faceapi.draw.DrawBox(box, { label: result.toString(), boxColor: '#50c878' });
            drawBox.draw(overlay);
        });
    }, 100);
});

// Initialize
loadStoredFaces();
loadModels();
