import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, location, message, type, date, time } = body;

    if (!name || !phone) {
      return NextResponse.json(
        { error: "Name and phone are required" },
        { status: 400 }
      );
    }

    const isMeetingRequest = type === "meeting";

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #013344 0%, #05596B 100%); padding: 40px 30px; text-align: center; }
            .header h1 { color: white; font-size: 28px; font-weight: 700; margin: 0; }
            .header p { color: #8DD3E5; font-size: 14px; margin-top: 8px; }
            .content { padding: 40px 30px; background: white; }
            .info-row { margin-bottom: 24px; padding-bottom: 24px; border-bottom: 1px solid #e5e5e5; }
            .info-row:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
            .label { font-size: 12px; font-weight: 600; color: #013344; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; }
            .value { font-size: 16px; color: #1a1a1a; font-weight: 500; line-height: 1.5; }
            .footer { background: #f9f9f9; padding: 20px 30px; text-align: center; border-top: 1px solid #e5e5e5; }
            .footer p { color: #666; font-size: 12px; margin: 0; }
            .badge { display: inline-block; background: #8DD3E5; color: #013344; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; margin-top: 10px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>${isMeetingRequest ? "📅 Meeting Request" : "📧 New Contact"}</h1>
              <p>${isMeetingRequest ? "A new meeting has been scheduled" : "Someone wants to get in touch"}</p>
            </div>
            <div class="content">
              <div class="info-row">
                <div class="label">Full Name</div>
                <div class="value">${name}</div>
              </div>
              <div class="info-row">
                <div class="label">Phone Number</div>
                <div class="value">${phone}</div>
              </div>
              ${isMeetingRequest ? `
                <div class="info-row">
                  <div class="label">Preferred Date</div>
                  <div class="value">${new Date(date).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</div>
                </div>
                <div class="info-row">
                  <div class="label">Preferred Time</div>
                  <div class="value">${time}</div>
                </div>
              ` : `
                <div class="info-row">
                  <div class="label">Preferred Location</div>
                  <div class="value">${location}</div>
                </div>
                ${message ? `
                  <div class="info-row">
                    <div class="label">Message</div>
                    <div class="value">${message}</div>
                  </div>
                ` : ""}
              `}
            </div>
            <div class="footer">
              <p>This email was sent from <strong>Strada Properties</strong> website</p>
              <span class="badge">${isMeetingRequest ? "MEETING REQUEST" : "CONTACT FORM"}</span>
            </div>
          </div>
        </body>
      </html>
    `;

    const { data, error } = await resend.emails.send({
      from: "Strada Properties <onboarding@resend.dev>",
      to: ["sales@strada-properties.com"],
      subject: isMeetingRequest
        ? `Meeting Request from ${name}`
        : `New Contact from ${name}`,
      html: emailHtml,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Email send error:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
