/* SKILL FIELDS
name
description
pictures?
price
location
*/

const newSkill = () => {
  let name = null;
  let description = null;
  let price = null;
  let location = null;
  const self = {
    getName: () => name,
    setName: (newName) => {
      name = newName;
      return self;
    },
    getDescription: () => description,
    setDescription: (newDescription) => {
      description = newDescription;
      return self;
    },
    getPrice: () => price,
    setPrice: (newPrice) => {
      price = newPrice;
      return self;
    },
    getLocation: () => location,
    setLocation: (newLocation) => {
      location = newLocation;
      return self;
    },
  };
  return self;
};

module.exports = {
  newSkill,
};
