import React, { useEffect, useState } from "react";
import moment from "moment";
import ReactTimeline from "react-calendar-timeline";
import "react-calendar-timeline/lib/Timeline.css";
import { CalDavService } from "./services";

const App = () => {
    const [items, setItems] = useState<any[]>([]);

    useEffect(() => {
        CalDavService.getAllEvents(
            process.env.REACT_APP_NEXTCLOUD_CALENDAR_URL || ""
        ).then((response) => {
            setItems(response.map((item) => ({ ...item, group: 1 })));
        });
    }, []);

    return (
        <ReactTimeline
            groups={[{ id: 1, title: "Wydarzenia" }]}
            items={items}
            defaultTimeStart={moment().add(-12, "hour")}
            defaultTimeEnd={moment().add(12, "hour")}
        />
    );
};

export default App;
