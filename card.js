#!/usr/bin/env node

import boxen from 'boxen';
import chalk from 'chalk';
import figlet from 'figlet';
import inquirer from 'inquirer';
import { createSpinner } from 'nanospinner';
import openURL from 'open';
import { dirname } from 'path';
import { setTimeout as sleep } from 'timers/promises';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Basic capability detection
const SUPPORTS_TTY = Boolean(process.stdout && process.stdout.isTTY);
const NO_COLOR_ENV = Boolean(process.env.NO_COLOR);

// Flags based on CLI args and environment
const argv = process.argv.slice(2);
const FAST_MODE = argv.includes('--fast') || argv.includes('-f');
const NO_ANIM = argv.includes('--no-anim') || argv.includes('--no-animation') || !SUPPORTS_TTY;

// Configuration object with contact information and theme settings
const CONFIG = {
  PERSONAL_INFO: {
    NAME: 'Lohit Kolluri',
    TITLE: 'SDE | Backend & DevOps Engineer | Distributed Systems | Kubernetes, CI/CD, Cloud',
    LOCATION: 'Chennai, Tamil Nadu, India',
    EDUCATION: 'B.Tech CSE, SRM Institute of Science and Technology',
    SKILLS: [
      'Agentic AI',
      'Backend Development',
      'Distributed Systems',
      'Kubernetes',
      'CI/CD',
      'Observability',
    ],
  },
  URLS: {
    EMAIL: 'mailto:lohitkolluri@gmail.com',
    RESUME:
      'https://drive.google.com/file/u/1/d/1KwoW5uTW2aUEoi14CnM6JGQatup_5aAf/view?usp=sharing',
    MEETING: 'https://calendly.com/lohitkolluri/30min',
    PORTFOLIO: 'https://lohit.is-a.dev/',
    GITHUB: 'https://github.com/lohitkolluri',
    LINKEDIN: 'https://linkedin.com/in/kollurilohit',
  },
  THEME: {
    BORDER_COLOR: '#6E6E6E',
    BG_COLOR: '#0F0F0F',
    ANIMATION_SPEED: {
      FAST: FAST_MODE ? 0 : 10,
      MEDIUM: FAST_MODE ? 0 : 30,
      SLOW: FAST_MODE ? 0 : 50,
    },
    ANIMATIONS_ENABLED: !NO_ANIM,
    EMOJI_ENABLED: SUPPORTS_TTY && !process.env.NO_EMOJI,
    COLORS_ENABLED: !NO_COLOR_ENV,
  },
};

// Utility functions
const maybeEmoji = (char) => (CONFIG.THEME.EMOJI_ENABLED ? char : '');

const createAnimatedSpinner = async (text, duration = 500) => {
  const spinner = createSpinner(text).start();
  if (CONFIG.THEME.ANIMATIONS_ENABLED && duration > 0) {
    await sleep(duration);
  }
  return spinner;
};

const animateText = async (text, speed = CONFIG.THEME.ANIMATION_SPEED.FAST) => {
  process.stdout.write('\n');
  for (const char of text) {
    process.stdout.write(char);
    if (CONFIG.THEME.ANIMATIONS_ENABLED && speed > 0) {
      await sleep(speed);
    }
  }
  process.stdout.write('\n');
};

// Component for welcome banner
const WelcomeBanner = async () => {
  console.clear();
  console.log('\n');
  const spinner = await createAnimatedSpinner("Booting Lohit's card...", 200);
  spinner.success();

  return new Promise((resolve) => {
    figlet(
      CONFIG.PERSONAL_INFO.NAME,
      {
        font: 'Big',
        horizontalLayout: 'default',
        verticalLayout: 'default',
      },
      async (err, data) => {
        if (!err) {
          const lines = data.split('\n');
          for (const line of lines) {
            console.log(chalk.white(line));
            if (CONFIG.THEME.ANIMATIONS_ENABLED) {
              await sleep(CONFIG.THEME.ANIMATION_SPEED.MEDIUM);
            }
          }
          await animateText(`{ ${CONFIG.PERSONAL_INFO.TITLE} }`, CONFIG.THEME.ANIMATION_SPEED.SLOW);
        }
        resolve();
      },
    );
  });
};

// Component for profile card
const ProfileCard = async () => {
  const cardData = {
    name: chalk.white.bold(CONFIG.PERSONAL_INFO.NAME),
    title: chalk.hex('#A0A0A0')(CONFIG.PERSONAL_INFO.TITLE),
    education: `${chalk.hex('#A0A0A0')('Education')}  ${chalk.white(
      CONFIG.PERSONAL_INFO.EDUCATION,
    )}`,
    location: `${chalk.hex('#A0A0A0')('Location')}   ${chalk.white(CONFIG.PERSONAL_INFO.LOCATION)}`,
    github: `${chalk.hex('#6E6E6E')('github.com/')} ${chalk.cyan('lohitkolluri')}`,
    linkedin: `${chalk.hex('#6E6E6E')('linkedin.com/in/')} ${chalk.cyan('kollurilohit')}`,
    web: `${chalk.hex('#6E6E6E')('Portfolio:')} ${chalk.cyan(CONFIG.URLS.PORTFOLIO)}`,
    npx: `${chalk.white('npx')} ${chalk.white('lohitkolluri')}`,
    skills: chalk.white(CONFIG.PERSONAL_INFO.SKILLS.join(' | ')),
  };

  const card = boxen(
    [
      cardData.name,
      cardData.title,
      '',
      chalk.gray('I build backend & DevOps systems that scale and stay reliable under pressure.'),
      chalk.gray(
        'Focused on distributed systems, observability, Kubernetes, and CI/CD for production workloads.',
      ),
      '',
      `${cardData.education}`,
      `${cardData.location}`,
      '',
      `${chalk.hex('#6E6E6E')('Skills:')} ${cardData.skills}`,
      '',
      `${chalk.hex('#6E6E6E')('GitHub   ')} ${cardData.github}`,
      `${chalk.hex('#6E6E6E')('LinkedIn ')} ${cardData.linkedin}`,
      `${cardData.web}`,
      '',
      `Card:      ${cardData.npx}`,
      '',
      chalk.white('Available for exciting opportunities and collaborations.'),
      chalk.gray('Let’s connect and create something great together.'),
      '',
      chalk.dim(`Last updated: 2026-04`),
    ].join('\n'),
    {
      padding: 1,
      margin: 1,
      borderStyle: 'round',
      borderColor: CONFIG.THEME.BORDER_COLOR,
      float: 'center',
      backgroundColor: CONFIG.THEME.BG_COLOR,
      title: chalk.green.bold("Lohit's Business Card"),
      titleAlignment: 'center',
    },
  );

  for (const line of card.split('\n')) {
    console.log(line);
    if (CONFIG.THEME.ANIMATIONS_ENABLED) {
      await sleep(CONFIG.THEME.ANIMATION_SPEED.FAST);
    }
  }
};

const safeOpen = async (url, { label }) => {
  try {
    await openURL(url);
    return { ok: true };
  } catch (err) {
    console.error(chalk.red(`\nFailed to open ${label}.`));
    console.error(chalk.red('Error:'), err.message);
    console.log(chalk.yellow('You can manually open this link:\n'), chalk.cyan(url));
    return { ok: false, error: err };
  }
};

// Action handlers
const actionHandlers = {
  email: async () => {
    const spinner = await createAnimatedSpinner('Opening mail client...');
    await safeOpen(CONFIG.URLS.EMAIL, { label: 'mail client' });
    spinner.success({
      text: chalk.cyan(`${maybeEmoji('✉ ')}Email client opened (or link printed above).`),
    });
    await animateText(chalk.green('Looking forward to hearing from you!'));
  },

  viewResume: async () => {
    const spinner = await createAnimatedSpinner('Preparing to open resume...');
    const { ok } = await safeOpen(CONFIG.URLS.RESUME, { label: 'resume' });
    if (ok) {
      spinner.success({
        text: chalk.green(`Resume opened in your browser! ${maybeEmoji('🎉')}`),
      });
      await animateText(chalk.gray('Tip: You can download it directly from Google Drive.'));
    } else {
      spinner.error({ text: chalk.red('Unable to auto-open resume; link above.') });
    }
  },

  scheduleMeeting: async () => {
    const spinner = await createAnimatedSpinner('Opening scheduler...');
    await safeOpen(CONFIG.URLS.MEETING, { label: 'scheduler' });
    spinner.success({
      text: chalk.cyan(`${maybeEmoji('📅 ')}Scheduler opened (or link printed above).`),
    });
    await animateText(chalk.green('Excited to chat with you soon!'));
  },

  viewPortfolio: async () => {
    const spinner = await createAnimatedSpinner('Loading portfolio...');
    await safeOpen(CONFIG.URLS.PORTFOLIO, { label: 'portfolio' });
    spinner.success({
      text: chalk.cyan(`${maybeEmoji('🌐 ')}Portfolio opened (or link printed above).`),
    });
    await animateText(chalk.green('Hope you enjoy exploring my work!'));
  },

  viewGitHub: async () => {
    const spinner = await createAnimatedSpinner('Opening GitHub...');
    await safeOpen(CONFIG.URLS.GITHUB, { label: 'GitHub' });
    spinner.success({
      text: chalk.cyan(`${maybeEmoji('💻 ')}GitHub profile opened (or link printed above).`),
    });
    await animateText(chalk.green('Check out my latest projects!'));
  },
};

// Menu options
const menuOptions = [
  {
    type: 'list',
    name: 'action',
    message: chalk.white('Select an action:'),
    choices: [
      {
        name: `${maybeEmoji('📧 ')}Email Lohit`,
        value: 'email',
      },
      {
        name: `${maybeEmoji('📄 ')}Open resume (PDF)`,
        value: 'viewResume',
      },
      {
        name: `${maybeEmoji('📅 ')}Schedule a meeting`,
        value: 'scheduleMeeting',
      },
      {
        name: `${maybeEmoji('🌐 ')}Visit portfolio`,
        value: 'viewPortfolio',
      },
      {
        name: `${maybeEmoji('💻 ')}View GitHub`,
        value: 'viewGitHub',
      },
      {
        name: `${maybeEmoji('⏻ ')}Exit`,
        value: 'quit',
      },
    ],
  },
];

// Main application
const main = async () => {
  try {
    await WelcomeBanner();
    await ProfileCard();

    console.log(
      chalk.hex('#A0A0A0')('\nTip: Use ') +
        chalk.white('cmd/ctrl + click') +
        chalk.hex('#A0A0A0')(' on links to open directly.\n'),
    );

    while (true) {
      const { action } = await inquirer.prompt(menuOptions);

      if (action === 'quit') {
        await animateText('\nThanks for stopping by! Have a great day!\n');
        break;
      }

      await actionHandlers[action]();
    }
  } catch (error) {
    console.error(chalk.red('\n❌ An error occurred:'), error.message);
    process.exit(1);
  }
};

// Run the application
main().catch(console.error);
