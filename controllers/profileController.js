const { Profile } = require('../models');

module.exports = {
  read(req, res) {
    const { id } = req.params;
    Profile.findById(id)
      .then((element) => {
        if (!element) {
          return res.status(404).json({ message: `User not found with id ${id}` });
        }
        return res.status(200).json(element);
      })
      .catch(() => res.status(404).json({ message: `User not found with id ${id}` }));
  },

  // check id if not number if has this id
  create(req, res) {
    Profile.create(req.body)
      .then(element => res.status(201).location(`/${element.id}/profile`))
      .catch(() => res.status(404).json({ message: 'Not found' }));
  },

  update(req, res) {
    // const objProps = Object.keys(Profile.rawAttributes);
    // const newProps = objProps.filter((value) => {
    //   return Profile.rawAttributes[value]
    //     ._autoGenerated === undefined;
    // });
    // console.log(newProps);
    // Profile.find;
    const { id } = req.params;
    // const { [gendr, age, about]} = req.body;
    Profile.findById(id)
      .then((element) => {
        if (!element) {
          return res.status(404).json({ message: `User not found with id ${id}` });
        }
        return element
          .update(req.body)
          .then(() => res.status(200));
      })
      .catch(() => res.status(404).json({ message: `User not found with id ${id}` }));
  },

  patch(req, res) {
    const { id } = req.params;

    Profile.findById(id)
      .then((element) => {
        if (!element) {
          return res.status(404).json({ message: `User not found with id ${id}` });
        }
        return element
          .patch(req.body)
          .then(() => res.status(200));
      })
      .catch(() => res.status(404).json({ message: `User not found with id ${id}` }));
  },

  remove(req, res) {
    const { id } = req.params; //
    Profile.findById(id)
      .then((element) => {
        if (!element) {
          return res.status(404).json({ message: `User not found with id ${id}` });
        }
        return element.destroy()
          .then(() => res.status(400));
      })
      .catch(() => res.status(404).json({ message: `User not found with id ${id}` }));
  },
};
