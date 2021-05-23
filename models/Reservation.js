const dayjs = require("dayjs");
const mongoose = require("mongoose");


const reservationSchema = mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: {
        type: String, required: true, lowercase: true, trim: true,
        match: [/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/, 'Invalid email format']
    },
    dateAdded: { type: Date, default: Date.now, required: true },
    startTime: { type: Date, min: Date.now, required: true },
    endTime: { type: Date, required: updateEndTime }
})


reservationSchema.pre('validate', function (next) {
    const weekend = new Set(["0", "6"]);
    const businessHours = {
        "opens": dayjs("2021-05-03T13:00:00Z").format("HH:mm:ss"),
        "breakStart": dayjs("2021-05-03T17:00:00Z").format("HH:mm:ss"),
        "breakEnd": dayjs("2021-05-03T18:00:00Z").format("HH:mm:ss"),
        "closes": dayjs("2021-05-03T22:00:00Z").format("HH:mm:ss")
    };

    const date = dayjs(this.startTime);
    const time = date.format("HH:mm:ss");
    const weekday = date.format("d");

    if (date.format("mm:ss") !== "00:00") {
        this.invalidate('startTime', 'must have the form HH:00:00', this.startTime);
    }

    if (weekend.has(weekday)) {
        this.invalidate('startTime', 'must must be part of a workweek', this.startTime);
    }

    if (time < businessHours.opens || time >= businessHours.closes || (time >= businessHours.breakStart && time < businessHours.breakEnd)) {
        this.invalidate('startTime', 'must be between business hours', this.startTime);
    }

    next();
});


function updateEndTime() {
    const minutes = 50;
    let end = new Date(this.startTime);
    end.setMinutes(end.getMinutes() + minutes);
    end = new Date(end);
    this.endTime = end;
}


module.exports = mongoose.model("Reservation", reservationSchema);

