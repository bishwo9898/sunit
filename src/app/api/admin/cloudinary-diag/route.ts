import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

export const dynamic = 'force-dynamic';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure:     true,
});

export async function GET() {
  const report: Record<string, unknown> = {};

  // Test 1: Ping – Check if credentials work at all
  try {
    const ping = await cloudinary.api.ping();
    report.ping = ping;
  } catch (e: any) {
    report.ping_error = e?.error ?? e?.message ?? JSON.stringify(e);
  }

  // Test 2: Root folders (legacy fixed-folder mode)
  try {
    const root = await cloudinary.api.root_folders();
    report.root_folders = root;
  } catch (e: any) {
    report.root_folders_error = e?.error ?? e?.message ?? JSON.stringify(e);
  }

  // Test 3: Asset folders (new dynamic-folder mode)
  try {
    const assetFolders = await cloudinary.api.asset_folders();
    report.asset_folders = assetFolders;
  } catch (e: any) {
    report.asset_folders_error = e?.error ?? e?.message ?? JSON.stringify(e);
  }

  // Test 4: Fetch any 5 resources with NO filter (brute-force sanity check)
  try {
    const any = await cloudinary.api.resources({ max_results: 5, type: 'upload' });
    report.any_resources_sample = any;
  } catch (e: any) {
    report.any_resources_error = e?.error ?? e?.message ?? JSON.stringify(e);
  }

  // Test 5: resources_by_asset_folder with the exact path from the screenshot
  for (const folder of ['Home/recents', 'Home/portraits', 'Home/weddings', 'Home/hero', 'recents', 'portraits', 'weddings', 'hero']) {
    try {
      const r = await cloudinary.api.resources_by_asset_folder(folder, { max_results: 3 });
      report[`asset_folder_${folder.replace('/', '_')}`] = { count: r.resources?.length, sample: r.resources?.slice(0, 2) };
    } catch (e: any) {
      report[`asset_folder_${folder.replace('/', '_')}_error`] = e?.error ?? e?.message ?? JSON.stringify(e);
    }
  }

  return NextResponse.json(report, { 
    headers: { 'Cache-Control': 'no-store' } 
  });
}
