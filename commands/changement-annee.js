const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
  name: '!changement-annee',
  async execute(message) {
    if (message.author.id !== process.env.ADMIN_ID) return;

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('valider_changement').setLabel('Valider le changement').setStyle(ButtonStyle.Success),
      new ButtonBuilder().setCustomId('annuler_changement').setLabel('Annuler').setStyle(ButtonStyle.Danger)
    );

    await message.reply({
      content: '⚠️ Confirmez-vous le changement de rôles de fin d’année ?',
      components: [row]
    });
  },

  async handleButton(interaction) {
    if (!interaction.isButton()) return;
    if (interaction.customId === 'annuler_changement') {
      await interaction.reply({ content: '❌ Opération annulée.', ephemeral: true });
      return;
    }

    if (interaction.customId === 'valider_changement' && interaction.user.id === process.env.ADMIN_ID) {
      await interaction.deferReply({ ephemeral: false });

      const guild = interaction.guild;
      const members = await guild.members.fetch();
      const getRole = name => guild.roles.cache.find(r => r.name === name);
      const filieres = ['AL', 'IW', 'SI', 'SRC'];

      let b1ToB2 = 0, b2ToB3 = 0;
      const b3ToM1 = {}, m1ToM2 = {}, m2ToAlumni = {};
      filieres.forEach(f => { b3ToM1[f] = 0; m1ToM2[f] = 0; m2ToAlumni[f] = 0; });

      for (const member of members.values()) {
        const roles = member.roles.cache.map(r => r.name);

        if (roles.includes('B1')) {
          const from = getRole('B1'), to = getRole('B2');
          if (from && to) { await member.roles.remove(from); await member.roles.add(to); b1ToB2++; }
        } else if (roles.includes('B2')) {
          const from = getRole('B2'), to = getRole('B3');
          if (from && to) { await member.roles.remove(from); await member.roles.add(to); b2ToB3++; }
        } else {
          for (const f of filieres) {
            const b3 = getRole(`B3 ${f}`), m1 = getRole(`M1 ${f}`), m2 = getRole(`M2 ${f}`), alum = getRole('Alumni');

            if (b3 && m1 && roles.includes(`B3 ${f}`)) {
              await member.roles.remove(b3); await member.roles.add(m1); b3ToM1[f]++;
            }
            if (m1 && m2 && roles.includes(`M1 ${f}`)) {
              await member.roles.remove(m1); await member.roles.add(m2); m1ToM2[f]++;
            }
            if (m2 && alum && roles.includes(`M2 ${f}`)) {
              await member.roles.remove(m2); await member.roles.add(alum); m2ToAlumni[f]++;
            }
          }
        }
      }

      const pluralize = (n, w) => `${n} ${w}${n > 1 ? 's' : ''}`;
      const formatBloc = (label, data) =>
        `**${label}**\n${Object.entries(data).map(([f, n]) => `- ${f} : ${pluralize(n, 'étudiant')}`).join('\n')}`;

      const embed = new EmbedBuilder()
        .setTitle('Changement d’année effectué')
        .setColor(0x00cc66)
        .setDescription(
          `**B1 → B2** : ${pluralize(b1ToB2, 'étudiant')}\n` +
          `**B2 → B3** : ${pluralize(b2ToB3, 'étudiant')}\n\n` +
          `${formatBloc('B3 → M1', b3ToM1)}\n\n${formatBloc('M1 → M2', m1ToM2)}\n\n${formatBloc('M2 → Alumni', m2ToAlumni)}`
        )
        .setFooter({ text: 'Tous les rôles ont été mis à jour avec succès.' });

      const csvLines = [
        'Transition,Filière,Nombre d\'étudiants',
        `B1 → B2,,${b1ToB2}`,
        `B2 → B3,,${b2ToB3}`,
        ...Object.entries(b3ToM1).map(([f, n]) => `B3 → M1,${f},${n}`),
        ...Object.entries(m1ToM2).map(([f, n]) => `M1 → M2,${f},${n}`),
        ...Object.entries(m2ToAlumni).map(([f, n]) => `M2 → Alumni,${f},${n}`)
      ];

      const date = new Date().toISOString().split('T')[0];
      const filename = `changement-changement-annee-${date}.csv`;
      const filePath = path.join(__dirname, '..', filename);
      fs.writeFileSync(filePath, csvLines.join('\n'));
      const attachment = new AttachmentBuilder(filePath, { name: filename });

      await interaction.editReply({ embeds: [embed], files: [attachment] });
      setTimeout(() => fs.unlink(filePath, () => {}), 5000);
    }
  }
};
