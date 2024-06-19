// app/api/milk-delivery/route.ts

import { NextResponse } from 'next/server';
import { createClient } from "@/utils/supabase/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const filter = searchParams.get('filter');
  const supabase = createClient();

  let fromDate;
  switch (filter) {
    case 'weekly':
      fromDate = new Date();
      fromDate.setDate(fromDate.getDate() - 7);
      break;
    case 'monthly':
      fromDate = new Date();
      fromDate.setMonth(fromDate.getMonth() - 1);
      break;
    case 'yearly':
      fromDate = new Date();
      fromDate.setFullYear(fromDate.getFullYear() - 1);
      break;
    default:
      fromDate = new Date(0); // all time
  }

  const { data, error } = await supabase
    .from('milk_delivery')
    .select('amount, delivery_date')
    .gte('delivery_date', fromDate.toISOString());

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const totalMilk = data.reduce((acc, curr) => acc + curr.amount, 0);
  return NextResponse.json({ totalMilk, data });
}

