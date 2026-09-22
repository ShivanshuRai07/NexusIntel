import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await fetch("http://127.0.0.1:8000/api/economy", { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(data);
    }
  } catch (error) {
    console.error("Error proxying to backend economy API:", error);
  }

  return NextResponse.json({
    crudeOilPrice: 78.45,
    crudeOilHistory: [70, 71, 73, 72, 74, 75, 76, 75, 77, 78, 79, 78.45],
    goldPrice: 2145.00,
    goldHistory: [2050, 2060, 2080, 2075, 2100, 2090, 2120, 2115, 2130, 2140, 2145],
    status: "fallback"
  });
}
