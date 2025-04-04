const { EmbedBuilder, AttachmentBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
  name: '!simulation-changement-annee',
  async execute(message) {
    if (message.author.id !== process.env.ADMIN_ID) return;

    const guild = message.guild;
    const members = await guild.members.fetch();
    const getRole = name => guild.roles.cache.find(r => r.name === name);
    const filieres = ['AL', 'IW', 'SI', 'SRC'];

    let b1ToB2 = 0;
    let b2ToB3 = 0;
    const b3ToM1 = {}, m1ToM2 = {}, m2ToAlumni = {};
    filieres.forEach(f => { b3ToM1[f] = 0; m1ToM2[f] = 0; m2ToAlumni[f] = 0; });

    for (const member of members.values()) {
      const roles = member.roles.cache.map(r => r.name);

      if (roles.includes('B1')) b1ToB2++;
      else if (roles.includes('B2')) b2ToB3++;
      else {
        for (const f of filieres) {
          if (roles.includes(`B3 ${f}`)) b3ToM1[f]++;
          if (roles.includes(`M1 ${f}`)) m1ToM2[f]++;
          if (roles.includes(`M2 ${f}`)) m2ToAlumni[f]++;
        }
      }
    }

    const pluralize = (n, w) => `${n} ${w}${n > 1 ? 's' : ''}`;
    const formatBloc = (label, data) =>
      `**${label}**\n${Object.entries(data).map(([f, n]) => `- ${f} : ${pluralize(n, 'étudiant')}`).join('\n')}`;

    const embed = new EmbedBuilder()
      .setTitle('Simulation de changement d’année')
      .setColor(0x0099FF)
      .setDescription(
        `**B1 → B2** : ${pluralize(b1ToB2, 'étudiant')}\n` +
        `**B2 → B3** : ${pluralize(b2ToB3, 'étudiant')}\n\n` +
        `${formatBloc('B3 → M1', b3ToM1)}\n\n${formatBloc('M1 → M2', m1ToM2)}\n\n${formatBloc('M2 → Alumni', m2ToAlumni)}`
      )
      .setFooter({ text: 'Ceci est une simulation. Aucun rôle n’a été modifié.' });

    const csvLines = [
      'Transition,Filière,Nombre d\'étudiants',
      `B1 → B2,,${b1ToB2}`,
      `B2 → B3,,${b2ToB3}`,
      ...Object.entries(b3ToM1).map(([f, n]) => `B3 → M1,${f},${n}`),
      ...Object.entries(m1ToM2).map(([f, n]) => `M1 → M2,${f},${n}`),
      ...Object.entries(m2ToAlumni).map(([f, n]) => `M2 → Alumni,${f},${n}`)
    ];

    const date = new Date().toISOString().split('T')[0];
    const filename = `simulation-changement-annee-${date}.csv`;
    const filePath = path.join(__dirname, '..', filename);
    fs.writeFileSync(filePath, csvLines.join('\n'));
    const attachment = new AttachmentBuilder(filePath, { name: filename });

    await message.reply({ embeds: [embed], files: [attachment] });

    setTimeout(() => fs.unlink(filePath, () => {}), 5000);
  }
};
