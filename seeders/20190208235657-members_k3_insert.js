'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
     return queryInterface.bulkInsert('members', [{
      name: 'Beby Chaesara Anadila',
      team: 'K3',
      slug: 'beby',
      image_url: 'https://jkt48.com/profile/beby_chaseara_anadila_s.jpg?r=20170308',
      active: true,
     createdAt: Sequelize.fn('NOW'),
     updatedAt: Sequelize.fn('NOW')
    }, {
      name: 'Jennifer Rachel Natasya',
      team: 'K3',
      slug: 'rachel',
      image_url: 'https://jkt48.com/profile/jennifer_rachel_natasya_s.jpg?r=20170308',
      active: true,
     createdAt: Sequelize.fn('NOW'),
     updatedAt: Sequelize.fn('NOW')
    }, {
      name: 'M.G.N Desy P.G.',
      team: 'K3',
      slug: 'desy',
      image_url: 'https://jkt48.com/profile/maria_genoveva_natalia_desy_purnamasari_gunawan.jpg',
      active: true,
     createdAt: Sequelize.fn('NOW'),
     updatedAt: Sequelize.fn('NOW')
    }, {
      name: 'Erika Ebisawa Kuswan',
      team: 'K3',
      slug: 'erika',
      image_url: 'https://jkt48.com/profile/erika_s.jpg?r=20170308',
      active: true,
     createdAt: Sequelize.fn('NOW'),
     updatedAt: Sequelize.fn('NOW')
    }, {
      name: 'Rona Anggreani',
      team: 'K3',
      slug: 'rona',
      image_url: 'https://jkt48.com/profile/rona_ariesta_anggraeni_s.jpg?r=20170308',
      active: true,
     createdAt: Sequelize.fn('NOW'),
     updatedAt: Sequelize.fn('NOW')
    }, {
      name: 'Nadila Cindi Wantari',
      team: 'K3',
      slug: 'nadila',
      image_url: 'https://jkt48.com/profile/nadila_cindi_wantari_s.jpg?r=20170308',
      active: true,
     createdAt: Sequelize.fn('NOW'),
     updatedAt: Sequelize.fn('NOW')
    }, {
      name: 'Viviyona Apriani',
      team: 'K3',
      slug: 'yona',
      image_url: 'https://jkt48.com/profile/viviyona_apriani_s.jpg?r=20170308',
      active: true,
     createdAt: Sequelize.fn('NOW'),
     updatedAt: Sequelize.fn('NOW')
    }, {
      name: 'Ratu Vienny Fitrilya',
      team: 'K3',
      slug: 'viny',
      image_url: 'https://jkt48.com/profile/ratu_vienny_fitrilya_s.jpg?r=20170308',
      active: true,
     createdAt: Sequelize.fn('NOW'),
     updatedAt: Sequelize.fn('NOW')
    }, {
      name: 'Fransisca Saraswati Puspa Dewi',
      team: 'K3',
      slug: 'sisca',
      image_url: 'https://jkt48.com/profile/fransisca_saraswati_puspa_dewi_s.jpg?r=20170308',
      active: true,
     createdAt: Sequelize.fn('NOW'),
     updatedAt: Sequelize.fn('NOW')
    }, {
      name: 'Kandiya Rafa Maulidita',
      team: 'K3',
      slug: 'indy',
      image_url: 'https://jkt48.com/profile/kandiya_rafa_maulidita_s.jpg?r=20170308',
      active: true,
     createdAt: Sequelize.fn('NOW'),
     updatedAt: Sequelize.fn('NOW')
    }, {
      name: 'Shani Indira Natio',
      team: 'K3',
      slug: 'shani',
      image_url: 'https://jkt48.com/profile/shani_indira_natio_s.jpg?r=20170308',
      active: true,
     createdAt: Sequelize.fn('NOW'),
     updatedAt: Sequelize.fn('NOW')
    }, {
      name: 'Shania Gracia',
      team: 'K3',
      slug: 'gracia',
      image_url: 'https://jkt48.com/profile/shania_gracia_s.jpg?r=20170308',
      active: true,
     createdAt: Sequelize.fn('NOW'),
     updatedAt: Sequelize.fn('NOW')
    }, {
      name: 'Aninditha Rahma Cahyadi',
      team: 'K3',
      slug: 'anin',
      image_url: 'https://jkt48.com/profile/aninditha_rahma_cahyadi_s.jpg?r=20170308',
      active: true,
     createdAt: Sequelize.fn('NOW'),
     updatedAt: Sequelize.fn('NOW')
    }, {
      name: 'Natalia',
      team: 'K3',
      slug: 'nat',
      image_url: 'https://jkt48.com/profile/natalia_s.jpg?r=20170308',
      active: true,
     createdAt: Sequelize.fn('NOW'),
     updatedAt: Sequelize.fn('NOW')
    }, {
      name: 'Ni Made Ayu Vania Aurellia',
      team: 'K3',
      slug: 'aurel',
      image_url: 'https://jkt48.com/profile/made_ayu_vania_aurellia_s.jpg?r=20170308',
      active: true,
     createdAt: Sequelize.fn('NOW'),
     updatedAt: Sequelize.fn('NOW')
    }, {
      name: 'Alicia Chanzia',
      team: 'K3',
      slug: 'acha',
      image_url: 'https://jkt48.com/profile/alicia_chanzia_ayu_kumaseh_s.jpg?r=20170308',
      active: true,
     createdAt: Sequelize.fn('NOW'),
     updatedAt: Sequelize.fn('NOW')
    }])
  },

  down: (queryInterface, Sequelize) => {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete('setlists', {
      slug: {
        [Op.in]: ['beby', 'rachel', 'desy', 'erika', 'rona', 'nadila', 'yona', 'viny', 'sisca', 'indy', 'shani', 'gracia', 'anin', 'nat', 'aurel', 'acha']
      }
    }, {})
  }
};
