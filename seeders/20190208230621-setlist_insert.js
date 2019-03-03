'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
   return queryInterface.bulkInsert('setlists', [{
     name: 'Saka Agari',
     slug: 'SA',
     image_url: 'https://4.bp.blogspot.com/-NWTxS6Lg55M/WpwAjdBGDBI/AAAAAAAAC2E/8mt1lr4-Y6Ase9ZJCUGPTtV_52UiMTEMACLcBGAs/s1600/Saka%2BAgari%2BTeam%2BKIII%2Bshonichi.jpg',
     active: true,
     createdAt: Sequelize.fn('NOW'),
     updatedAt: Sequelize.fn('NOW')
   }, {
     name: 'Dewi Theater',
     slug: 'TNM',
     image_url: 'https://i1.sndcdn.com/artworks-000138098431-5a8eli-t500x500.jpg',
     active: true,
     createdAt: Sequelize.fn('NOW'),
     updatedAt: Sequelize.fn('NOW')
   }, {
     name: 'Sekarang Sedang Jatuh Cinta',
     slug: 'Tadaima',
     image_url: 'https://pbs.twimg.com/media/DALiCG5UMAYFLlB.jpg',
     active: true,
     createdAt: Sequelize.fn('NOW'),
     updatedAt: Sequelize.fn('NOW')
   }, {
     name: 'Sambil Menggandeng Erat Tanganku',
     slug: 'TWT',
     image_url: 'https://i1.sndcdn.com/artworks-000126308348-92gpqw-t500x500.jpg',
     active: false,
     createdAt: Sequelize.fn('NOW'),
     updatedAt: Sequelize.fn('NOW')
   }])
  },

  down: (queryInterface, Sequelize) => {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete('setlists', {
      name: {
        [Op.in]: ['Saka Agari', 'Dewi Theater', 'Sekarang Sedang Jatuh Cinta', 'Sambil Menggandeng Erat Tanganku']
      }
    }, {})
  }
};
