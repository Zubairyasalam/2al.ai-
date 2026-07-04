import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const configPath = path.join(process.cwd(), "src/data/site-config.json");

export async function GET() {
  try {
    const data = await fs.readFile(configPath, "utf-8");
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    return NextResponse.json({ message: "Failed to read config" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Read the current configuration to preserve any untouched fields
    const data = await fs.readFile(configPath, "utf-8");
    const currentConfig = JSON.parse(data);

    // Merge new config values
    const newConfig = {
      ...currentConfig,
      ...body,
    };

    // Save back to JSON file
    await fs.writeFile(configPath, JSON.stringify(newConfig, null, 2), "utf-8");

    return NextResponse.json({ message: "Configuration updated successfully", config: newConfig });
  } catch (error) {
    console.error("Config update error:", error);
    return NextResponse.json({ message: "Failed to update config" }, { status: 500 });
  }
}
