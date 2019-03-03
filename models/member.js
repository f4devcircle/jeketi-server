'use strict';
module.exports = (sequelize, DataTypes) => {
  const member = sequelize.define('member', {
    member_id: DataTypes.INTEGER,
    name: DataTypes.STRING,
    team: DataTypes.STRING,
    slug: DataTypes.STRING,
    image_url: DataTypes.STRING
  }, {});
  member.associate = function(models) {
    // associations can be defined here
  };
  return member;
};