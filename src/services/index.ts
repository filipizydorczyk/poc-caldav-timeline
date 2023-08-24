import axios from "axios";
// import path from "path";
// import fs from "fs";
import { CalDavMapper, CalednarEntity } from "../mappers";
// import body from "../../res/caldav_all_events.xml";

const ResourceService = {
    getXmlResource: (name: string) => {
        // const fullPath = path.join(__dirname, `../../res/${name}.xml`);
        // return fs.readFileSync(fullPath);

        return /* XML */ `<?xml version="1.0" encoding="utf-8"?>
        <C:calendar-query xmlns:D="DAV:" xmlns:C="urn:ietf:params:xml:ns:caldav">
            <D:prop>
                <D:getetag />
                <C:calendar-data />
            </D:prop>
            <C:filter>
                <C:comp-filter name="VCALENDAR">
                    <C:comp-filter name="VEVENT">
                        <C:time-range start="20230814T000000Z" />
                    </C:comp-filter>
                </C:comp-filter>
            </C:filter>
        </C:calendar-query>`;
    },
};

const CalDavService = {
    getAllEvents: async (url: string): Promise<CalednarEntity[]> => {
        const username = process.env.REACT_APP_NEXTCLOUD_USERNAME || "";
        const password = process.env.REACT_APP_NEXTCLOUD_PASSWD || "";
        const resp = await axios({
            method: "REPORT",
            url,
            auth: { username, password },
            headers: { Depth: "1", "Content-Type": "application/xml" },
            data: ResourceService.getXmlResource("caldav_all_events"),
        });

        if (resp?.data && typeof resp?.data === "string") {
            return CalDavMapper.parseCalDavString(resp?.data);
        }

        return [];
    },
};

export { CalDavService, ResourceService };
