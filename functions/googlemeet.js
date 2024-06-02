const { JWT } = require("google-auth-library");
const { calendar_v3 } = require("@googleapis/calendar");
const Calander = calendar_v3.Calendar;
const credential = require("./school-mvp-45caa-1c41c03d3ef5.json");

const createEvent = async (emails, startDate, endDate) => {
  try {
    // Making auth object to tell that we are authenticated and for authentication purpose we are using info from service-accoun.json file
    const requestId = Math.floor(Math.random() * 100000);
    const auth = new JWT(
      credential.client_email,
      null,
      credential.private_key,
      ["https://www.googleapis.com/auth/calendar"],
      "admin@test-erp-test.vercel.app", // Your Google admin account email will come here
      credential.client_id
    );

    const calendar = new Calander({ version: "v3", auth });

    const event = {
      summary: "Google Meet",
      description: "Google Meet link for both emails",
      start: {
        dateTime: startDate,
        timeZone:'Africa/Algiers'
      },
      end: {
        dateTime:endDate,
        timeZone:'Africa/Algiers'
      },
      conferenceData: {
        createRequest: {
          requestId: requestId,
          conferenceSolutionKey: {
            type: "hangoutsMeet",
          },
        },
      },
      attendees: emails.map(email => ({ email })),
    };

    const response = await calendar.events.insert({
      calendarId: "primary",
      resource: event,
      conferenceDataVersion: 1,
    });

    return response.data.hangoutLink;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports = { createEvent };