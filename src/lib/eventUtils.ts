// Placeholder URL — replace with your actual Google Apps Script URL when ready
export const GOOGLE_SHEETS_SCRIPT_URL = "";

interface EventRegistrationPayload {
  userName: string;
  userEmail: string;
  userAge: string | null;
  userInstitution: string | null;
  userDepartment: string | null;
  eventTitle: string;
  eventDate: string;
}

export async function sendRegistrationToSheet(payload: EventRegistrationPayload): Promise<boolean> {
  if (!GOOGLE_SHEETS_SCRIPT_URL) {
    console.warn("[EventUtils] GOOGLE_SHEETS_SCRIPT_URL not configured — skipping sheet POST");
    return true; // silently succeed so the rest of the flow works
  }

  try {
    const response = await fetch(GOOGLE_SHEETS_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return response.ok;
  } catch (err) {
    console.error("[EventUtils] Failed to send to Google Sheet:", err);
    return false;
  }
}
