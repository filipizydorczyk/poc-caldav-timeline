import { parseString } from "xml2js";
import ical from "node-ical";
import moment from "moment";

export type CalednarEntity = {
    id: number;
    uuid: string;
    title: string;
    start_time: moment.Moment;
    end_time: moment.Moment;
};

const XmlMapper = {
    parseXmlStringToJson: async (content: string): Promise<Object> => {
        return new Promise((resolve, reject) => {
            parseString(content, (err, result) => {
                if (err) {
                    reject(err);
                }

                resolve(result);
            });
        });
    },
};

const CalDavMapper = {
    /**
     * Be carefull with this method. Since Caldav is a versy nested structure
     * and its very diffrent based on request you did it will not work with
     * every caldav response. This method was tested only with **REMOTE**
     * `remote.php/dav/calendars/username/calendar` request with
     * `res/caldav_all_events.xml` in body. It might be diffrent for other
     * providers and sinve this project is simply poc I did not bother to
     * make this function more general.
     *
     * @param data string returned from mentioned request
     */
    parseCalDavString: async (data: string): Promise<CalednarEntity[]> => {
        const parsedXml: any = await XmlMapper.parseXmlStringToJson(data);
        const response: CalednarEntity[] = [];
        let id = 0;

        if (
            !parsedXml?.["d:multistatus"]?.["d:response"] ||
            !parsedXml?.["d:multistatus"]?.["d:response"].length
        ) {
            Promise.reject(
                "Parsed xml is not present or is in incorrect format!"
            );
        }

        parsedXml["d:multistatus"]["d:response"].forEach((element: any) => {
            const entity = ical.sync.parseICS(
                element["d:propstat"][0]["d:prop"][0]["cal:calendar-data"][0]
            );
            const uuid = Object.keys(entity)[0];
            const calendarData: any = entity[uuid];

            response.push({
                id,
                uuid,
                title: calendarData.summary,
                start_time: moment(new Date(calendarData.start)),
                end_time: moment(new Date(calendarData.end)),
            });

            id = id + 1;
        });

        return response;
    },
};

export { XmlMapper, CalDavMapper };
