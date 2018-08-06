const {
  Trip, UsersTrips, User, Sequelize,
} = require('../models');

const error = new Error();

module.exports = {

  getAllTripsUniversal(req, res, next) {
    const { Op } = Sequelize;
    if (req.query) {
      if (req.query.tripCost) {
        const arr = req.query.tripCost.split('-');
        req.query.tripCost = {
          [Op.between]: arr,
        };
      }
      if (req.query.dateStart) {
        req.query.dateStart = {
          [Op.gte]: req.query.dateStart,
        };
      }
      if (req.query.dateEnd) {
        req.query.dateEnd = {
          [Op.lte]: req.query.dateEnd,
        };
      }
      if (req.query.description) {
        req.query.description = {
          [Op.like]: (`%${req.query.description}%`),
        };
      }
      Trip.findAll({
        where: { ...req.query },
      })
        .then((trips) => {
          if (!trips.length) {
            error.name = 'tripNotFound';
            return next(error);
          }
          const modifiedTrips = trips.map((trip) => {
            UsersTrips.findOne({
              where: {
                userId: req.session.userId,
                tripId: trip.getDataValue('id'),
              },
            })
              .then((eachTrip) => {
                if (eachTrip) {
                  trip.setDataValue('isSubscribed', 'true');
                } else {
                  trip.setDataValue('isSubscribed', 'false');
                }
                console.log(JSON.stringify(trip));
                return JSON.stringify(trip);
              });
          });
          console.log(`modified trips -> ${modifiedTrips}`);
          // console.log(JSON.stringify(trips));
          return res.status(200).json(trips);
        })
        .catch(err => next(err));
    } else {
      Trip.findAll().then((trips) => {
        res.status(200).json(trips);
      }).catch(err => next(err));
    }
  },

  // Create and Save a new Trip
  createTrip(req, res, next) {
    Trip.create({
      name: req.body.name,
      dateStart: req.body.dateStart,
      dateEnd: req.body.dateEnd,
      locationStart: req.body.locationStart,
      locationEnd: req.body.locationEnd,
      tripCost: req.body.tripCost,
      description: req.body.description,
      userId: req.session.userId,
    }).then(() => {
      res.status(201).location(`${req.url}`).end();
    }).catch(err => next(err));
  },

  // Retrieve and return all trips from the database.
  getAllTrips(req, res, next) {
    Trip.findAll().then((trips) => {
      res.status(200).json(trips);
    }).catch(err => next(err));
  },

  // Find a single trip with a tripId
  getTripById(req, res, next) {
    const { tripId: reqTripId } = req.params;
    Trip.findById(reqTripId).then((trip) => {
      if (!trip) {
        error.name = 'tripNotFound';
        return next(error);
      }
      return res.status(200).json(trip);
    }).catch(err => next(err));
  },


  getTripsCreatedByUser(req, res, next) {
    Trip.findAll({
      where: {
        userId: req.session.userId,
      },
    }).then((trips) => {
      if (!trips.length) {
        error.name = 'tripNotFound';
        return next(error);
      }
      return res.status(200).json(trips);
    }).catch(err => next(err));
  },

  getOneTripOfUser(req, res, next) {
    const { tripId: reqTripId } = req.params;
    Trip.findOne({
      where: {
        id: reqTripId,
        userId: req.session.userId,
      },
    }).then((trip) => {
      if (!trip) {
        error.name = 'tripNotFound';
        return next(error);
      }

      return res.status(200).json(trip);
    }).catch(err => next(err));
  },

  updateTripOfUser(req, res, next) {
    const { tripId: reqTripId } = req.params;

    Trip.update(req.body, {
      where: {
        id: reqTripId,
        userId: req.user.id,
      },
    }).then((number) => {
      if (number[0] === 0) {
        error.name = 'tripNotFound';
        return next(error);
      }
      return res.status(200).send({ message: 'Trip updated successfully.' });
    }).catch(err => next(err));
  },

  deleteTripOfUser(req, res, next) {
    const { tripId: reqTripId } = req.params;
    Trip.destroy({
      where: {
        id: reqTripId,
        userId: req.session.userId,
      },
    }).then((numberOfRows) => {
      if (!numberOfRows) {
        error.name = 'tripNotFound';
        return next(error);
      }
      return res.status(200).send({ message: 'Trip deleted successfully.' }).end();
    }).catch(err => next(err));
  },

  subscribeToTrip(req, res, next) {
    UsersTrips.create({
      userId: req.session.userId,
      tripId: req.body.tripId,
    }).then(() => {
      res.status(201).location(`${req.url}`).end();
    }).catch(err => next(err));
  },

  unsubscribeToTrip(req, res, next) {
    UsersTrips.destroy({
      where: {
        userId: req.session.userId,
        tripId: req.body.tripId,
      },
    }).then((numberOfRows) => {
      if (!numberOfRows) {
        error.name = 'tripNotFound';
        return next(error);
      }
      return res.status(200).send({ message: 'UserTrip deleted successfully.' }).end();
    }).catch(err => next(err));
  },

  getTripsSubscribedByUser(req, res, next) {
    UsersTrips.findAll({
      where: {
        userId: req.session.userId,
      },
      attributes: [],
      include: [{
        model: Trip,
        attributes: ['id', 'name', 'dateStart', 'dateEnd', 'locationStart', 'locationEnd', 'tripCost'],
      },
      ],
    })
      .then((trips) => {
        if (!trips.length) {
          error.name = 'tripNotFound';
          return next(error);
        }
        return res.status(200).json(trips);
      }).catch(err => next(err));
  },

  getOneTripSubscribedByUser(req, res, next) {
    const { tripId: reqTripId } = req.params;
    UsersTrips.findAll({
      where: {
        userId: req.session.userId,
        tripId: reqTripId,
      },
      attributes: ['tripId'],
      include: [{
        model: Trip,
      }, {
        model: User,
        as: 'Creator',
        where: {
          id: req.session.userId,
        },
        attributes: ['login', 'email'],
      }],
    }).then((trips) => {
      if (!trips.length) {
        error.name = 'tripNotFound';
        return next(error);
      }
      return res.status(200).json(trips);
    }).catch(err => next(err));
  },
};
