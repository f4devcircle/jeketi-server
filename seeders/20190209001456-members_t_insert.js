'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('members', [{
      name: 'Fidly Immanda Azzahra',
      team: 'T',
      slug: 'fia',
      image_url: 'https://jkt48.com/profile/fidly_immanda_azzahra_s.jpg?r=20170308',
      active: true,
     createdAt: Sequelize.fn('NOW'),
     updatedAt: Sequelize.fn('NOW')
    }, {
      name: 'Hasyakyla Utami Kusumawardhani',
      team: 'T',
      slug: 'kyla',
      image_url: 'https://jkt48.com/profile/haskyla_utami_s.jpg?r=20170308',
      active: true,
     createdAt: Sequelize.fn('NOW'),
     updatedAt: Sequelize.fn('NOW')
    }, {
      name: 'Rinanda Syahputri',
      team: 'T',
      slug: 'nanda',
      image_url: 'https://jkt48.com/profile/rinanda_s.jpg?r=20170308',
      active: true,
     createdAt: Sequelize.fn('NOW'),
     updatedAt: Sequelize.fn('NOW')
    }, {
      name: 'Adhisty Zara',
      team: 'T',
      slug: 'zara',
      image_url: 'https://jkt48.com/profile/adhisty_zara_s.jpg?r=20170308',
      active: true,
     createdAt: Sequelize.fn('NOW'),
     updatedAt: Sequelize.fn('NOW')
    }, {
      name: 'Gabryela Marcelina',
      team: 'T',
      slug: 'aby',
      image_url: 'https://jkt48.com/profile/gabryela_marcelina_s.jpg?r=20170308',
      active: true,
     createdAt: Sequelize.fn('NOW'),
     updatedAt: Sequelize.fn('NOW')
    }, {
      name: 'Melati Putri Rahel Sesilia',
      team: 'T',
      slug: 'melati',
      image_url: 'https://jkt48.com/profile/melati_putri_rahel_s.jpg?r=20170308',
      active: true,
     createdAt: Sequelize.fn('NOW'),
     updatedAt: Sequelize.fn('NOW')
    }, {
      name: 'Jinan Safa Safira',
      team: 'T',
      slug: 'jinan',
      image_url: 'https://jkt48.com/profile/jinan_safa_safira_s.jpg?r=20170308',
      active: true,
     createdAt: Sequelize.fn('NOW'),
     updatedAt: Sequelize.fn('NOW')
    }, {
      name: 'Puti Nadhira Azalia',
      team: 'T',
      slug: 'pucchi',
      image_url: 'https://jkt48.com/profile/puti_nadhira_s.jpg?r=20170308',
      active: true,
     createdAt: Sequelize.fn('NOW'),
     updatedAt: Sequelize.fn('NOW')
    }, { 
      name: 'Syahfira Angela Nurhaliza',
      team: 'T',
      slug: 'angel',
      image_url: 'https://jkt48.com/profile/syahfira_angela_nurhaliza_s.jpg?r=20170308',
      active: true,
     createdAt: Sequelize.fn('NOW'),
     updatedAt: Sequelize.fn('NOW')
    }, {
      name: 'Tan Zhi Hui Celine',
      team: 'T',
      slug: 'celine',
      image_url: 'https://jkt48.com/profile/tan_zhi_hui_celine_s.jpg?r=20170308',
      active: true,
     createdAt: Sequelize.fn('NOW'),
     updatedAt: Sequelize.fn('NOW')
    }, {
      name: 'Sonia Natalia',
      team: 'T',
      slug: 'sonia',
      image_url: 'https://jkt48.com/profile/sonia_natalia_s.jpg?r=20170308',
      active: true,
     createdAt: Sequelize.fn('NOW'),
     updatedAt: Sequelize.fn('NOW')
    }, {
      name: 'Adriani Elisabeth',
      team: 'T',
      slug: 'lisa',
      image_url: 'https://jkt48.com/profile/adriani_elizabeth_s.jpg?r=20170308',
      active: true,
     createdAt: Sequelize.fn('NOW'),
     updatedAt: Sequelize.fn('NOW')
    }, {
      name: 'Ayana Shahab',
      team: 'T',
      slug: 'ayana',
      image_url: 'https://jkt48.com/profile/ayana_shahab_s.jpg?r=20170308',
      active: true,
     createdAt: Sequelize.fn('NOW'),
     updatedAt: Sequelize.fn('NOW')
    }, {
      name: 'Ayu Safira Oktaviani',
      team: 'T',
      slug: 'okta',
      image_url: 'https://jkt48.com/profile/ayu_safira_oktaviani_s.jpg?r=20170308',
      active: true,
     createdAt: Sequelize.fn('NOW'),
     updatedAt: Sequelize.fn('NOW')
    }, {
      name: 'Thalia Ivanka Elizabeth',
      team: 'T',
      slug: 'vanka',
      image_url: 'https://jkt48.com/profile/thalia_ivanka_elizabeth_frederik_s.jpg?r=20170308',
      active: true,
     createdAt: Sequelize.fn('NOW'),
     updatedAt: Sequelize.fn('NOW')
    }])
  },

  down: (queryInterface, Sequelize) => {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete('setlists', {
      slug: {
        [Op.in]: ['lisa', 'jinan', 'zara', 'okta', 'ayana', 'angel', 'pucchi', 'sonia', 'melati', 'kyla', 'fia', 'nanda', 'celine', 'vanka', 'aby']
      }
    }, {})
  }
};
