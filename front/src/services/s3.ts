interface UploadResponse {
  url?: string;
  error?: string;
}

export async function sendContextFile(file: File): Promise<UploadResponse> {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/S3", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      throw new Error(`Upload failed: ${res.statusText}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Upload error:", error);
    throw error;
  }
}
