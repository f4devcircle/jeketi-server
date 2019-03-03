'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('members', [{
      name: 'Ariella Calista Ichwan',
      team: 'J',
      slug: 'eril',
      image_url: 'https://jkt48.com/profile/ariel_s.jpg?r=20170308',
      active: true,
     createdAt: Sequelize.fn('NOW'),
     updatedAt: Sequelize.fn('NOW')
    }, {
      name: 'Saktia Oktapyani',
      team: 'J',
      slug: 'saktia',
      image_url: 'https://jkt48.com/profile/saktia_oktapyani_s.jpg?r=20170308',
      active: true,
     createdAt: Sequelize.fn('NOW'),
     updatedAt: Sequelize.fn('NOW')
    }, {
      name: 'Diani Amalia Ramadhani',
      team: 'J',
      slug: 'diani',
      image_url: 'https://jkt48.com/profile/diani_s.jpg?r=20170308',
      active: true,
     createdAt: Sequelize.fn('NOW'),
     updatedAt: Sequelize.fn('NOW')
    }, {
      name: 'Feni Fitriyanti',
      team: 'J',
      slug: 'feni',
      image_url: 'https://jkt48.com/profile/feni_fitriyanti_s.jpg?r=20170308',
      active: true,
     createdAt: Sequelize.fn('NOW'),
     updatedAt: Sequelize.fn('NOW')
    }, {
      name: 'Nurhayati',
      team: 'J',
      slug: 'aya',
      image_url: 'https://jkt48.com/profile/nurhayati_s.jpg?r=20170308',
      active: true,
     createdAt: Sequelize.fn('NOW'),
     updatedAt: Sequelize.fn('NOW')
    }, {
      name: 'Sinka Juliani',
      team: 'J',
      slug: 'sinka',
      image_url: 'https://jkt48.com/profile/sinka_juliani_s.jpg?r=20170308',
      active: true,
     createdAt: Sequelize.fn('NOW'),
     updatedAt: Sequelize.fn('NOW')
    }, {
      name: 'Michelle Christo Kusnadi',
      team: 'J',
      slug: 'michelle',
      image_url: 'https://jkt48.com/profile/michelle_christo_kusnadi_s.jpg?r=20170308',
      active: true,
     createdAt: Sequelize.fn('NOW'),
     updatedAt: Sequelize.fn('NOW')
    }, {
      name: 'Cindy Hapsari Maharani Pujiantoro Putri',
      team: 'J',
      slug: 'cinhap',
      image_url: 'https://jkt48.com/profile/cindy_hapsari_s.jpg?r=20170308',
      active: true,
     createdAt: Sequelize.fn('NOW'),
     updatedAt: Sequelize.fn('NOW')
    }, {
      name: 'Shania Junianatha',
      team: 'J',
      slug: 'shanju',
      image_url: 'https://jkt48.com/profile/shania_junianantha_s.jpg?r=20170308',
      active: true,
     createdAt: Sequelize.fn('NOW'),
     updatedAt: Sequelize.fn('NOW')
    }, {
      name: 'Sania Julia Montolalu',
      team: 'J',
      slug: 'julie',
      image_url: 'https://jkt48.com/profile/sania_julia_s.jpg?r=20170308',
      active: true,
     createdAt: Sequelize.fn('NOW'),
     updatedAt: Sequelize.fn('NOW')
    }, {
      name: 'Gabriela Margareth Warouw',
      team: 'J',
      slug: 'gaby',
      image_url: 'https://jkt48.com/profile/gabriella_s.jpg?r=20170308',
      active: true,
     createdAt: Sequelize.fn('NOW'),
     updatedAt: Sequelize.fn('NOW')
    }, {
      name: 'Stephanie Pricilla Indarto Putri',
      team: 'J',
      slug: 'stefi',
      image_url: 'https://jkt48.com/profile/stephanie_pricilla_indarto_putri_s.jpg?r=20170308',
      active: true,
     createdAt: Sequelize.fn('NOW'),
     updatedAt: Sequelize.fn('NOW')
    }, {
      name: 'Della Delila',
      team: 'J',
      slug: 'della',
      image_url: 'https://jkt48.com/profile/della_delila_s.jpg?r=20170308',
      active: true,
     createdAt: Sequelize.fn('NOW'),
     updatedAt: Sequelize.fn('NOW')
    }, {
      name: 'Cindy Yuvia',
      team: 'J',
      slug: 'yupi',
      image_url: 'https://jkt48.com/profile/cindy_yuvia_s.jpg?r=20170308',
      active: true,
     createdAt: Sequelize.fn('NOW'),
     updatedAt: Sequelize.fn('NOW')
    }, {
      name: 'Frieska Anastasia Laksani',
      team: 'J',
      slug: 'frieska',
      image_url: 'https://jkt48.com/profile/frieska_anastasia_laksani_s.jpg?r=20170308',
      active: true,
     createdAt: Sequelize.fn('NOW'),
     updatedAt: Sequelize.fn('NOW')
    }])
  },

  down: (queryInterface, Sequelize) => {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete('setlists', {
      slug: {
        [Op.in]: ['eril', 'saktia', 'diani', 'feni', 'aya', 'sinka', 'michelle', 'cinhap', 'shanju', 'julie', 'gaby', 'stefi', 'della', 'yupi', 'frieska']
      }
    }, {})
  }
};
