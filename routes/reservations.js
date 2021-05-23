const express = require('express');
const router = express.Router();
const Reservation = require('../models/Reservation');
const dayjs = require("dayjs");
const passport = require('passport');


router.get('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const { firstName, lastName, limit, page, email, sort, date } = req.query;

        const todayStart = date ? dayjs(date).startOf("day") : dayjs().startOf("day");
        const todayEnd = date ? dayjs(date).endOf("day") : dayjs().endOf("day");

        const query = {
            firstName: new RegExp(firstName, "i"),
            lastName: new RegExp(lastName, "i"),
            email: new RegExp(email, "i"),
            startTime: { $gt: todayStart, $lt: todayEnd }
        }

        const results = await Reservation
            .find(query)
            .sort({ startTime: sort })
            .limit(parseInt(limit))
            .skip(parseInt(limit) * parseInt(page - 1))

        res.status(200).json(results);
    } catch (err) {
        res.status(400).json({ error: "invalid request" });
    }
})


router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        if (id === "availability") {
            const { date } = req.query;
            let available = ["13", "14", "15", "16", "18", "19", "20", "21"];
            available = available.map(hr => `${date}T${hr}:00:00.000Z`);

            if (date === dayjs().format("YYYY-MM-DD")) {
                available = available.filter(d => new Date(d) > new Date());
            }

            const todayStart = date ? dayjs(date).startOf("day") : dayjs().startOf("day");
            const todayEnd = date ? dayjs(date).endOf("day") : dayjs().endOf("day");

            const query = {
                startTime: { $gt: todayStart, $lt: todayEnd }
            }

            const results = await Reservation
                .find(query, "startTime -_id")
                .sort({ startTime: "asc" })

            const unavailable = new Set(results.map(m => m.startTime.toISOString()));

            available = available.filter(t => !unavailable.has(t))

            return res.status(200).json({ "available": available });
        }

        const reservation = await Reservation.findById(id);

        if (!reservation) {
            throw "ID does not exist"
        }

        res.status(200).json(reservation);
    } catch (err) {
        res.status(400).json({ error: err });
    }
})


router.post("/", async (req, res) => {
    try {
        const reservation = new Reservation({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            startTime: req.body.startTime
        });

        const overlap = await Reservation.find({ startTime: { $eq: new Date(reservation.startTime) } });

        if (overlap.length) {
            throw { "error": "overlapping datetime intervals" }
        }

        const savedReservation = await reservation.save();
        res.status(200).json(savedReservation);
    } catch (err) {
        res.status(400).json(err);
    }
})


router.delete('/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const reservation = await Reservation.findByIdAndDelete(req.params.id);

        res.status(200).json(reservation);
    } catch (err) {
        res.status(400).json({ error: err });
    }
})


module.exports = router;