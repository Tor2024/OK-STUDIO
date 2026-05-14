/**
 * Automatisches Social Media Posting
 * Postet neue Artikel automatisch auf LinkedIn, Facebook, Twitter
 * 
 * Setup:
 * 1. Erstelle .env Datei mit API Keys
 * 2. npm install @octokit/rest
 * 3. Konfiguriere Webhooks in GitHub
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface Insight {
  id: string;
  title: string;
  date: string;
  tag: string;
  author: string;
  content?: string;
}

interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
}

interface SocialPost {
  platform: 'linkedin' | 'facebook' | 'twitter' | 'xing';
  content: string;
  url: string;
  imageUrl?: string;
}

/**
 * Generiert Social Media Posts für einen Artikel
 */
function generateInsightPosts(insight: Insight, baseUrl: string): SocialPost[] {
  const url = `${baseUrl}/insights/${insight.id}`;
  const imageUrl = `${baseUrl}/og-images/${insight.id}.png`;
  
  // Extrahiere ersten Absatz als Teaser
  const teaser = insight.content
    ? insight.content.split('\n\n')[0].replace(/[#*]/g, '').slice(0, 200) + '...'
    : '';

  return [
    {
      platform: 'linkedin',
      url,
      imageUrl,
      content: `🚀 Neuer Artikel: ${insight.title}

${teaser}

#WebDesign #Digitalisierung #${insight.tag}

Mehr lesen: ${url}`,
    },
    {
      platform: 'facebook',
      url,
      imageUrl,
      content: `${insight.title}

${teaser}

👉 ${url}`,
    },
    {
      platform: 'twitter',
      url,
      imageUrl,
      content: `🚀 ${insight.title}

${teaser.slice(0, 150)}...

${url}

#WebDesign #${insight.tag}`,
    },
    {
      platform: 'xing',
      url,
      imageUrl,
      content: `Neuer Artikel: ${insight.title}

${teaser}

Jetzt lesen: ${url}

#Digitalisierung #WebDesign`,
    },
  ];
}

/**
 * Generiert Social Media Posts für ein Projekt
 */
function generateProjectPosts(project: Project, baseUrl: string): SocialPost[] {
  const url = `${baseUrl}/work/${project.id}`;
  const imageUrl = `${baseUrl}/og-images/${project.id}.png`;

  return [
    {
      platform: 'linkedin',
      url,
      imageUrl,
      content: `✨ Neues Projekt im Portfolio: ${project.title}

${project.description}

Kategorie: ${project.category}

Case Study ansehen: ${url}

#WebDesign #Portfolio #${project.category.replace(/\s+/g, '')}`,
    },
    {
      platform: 'facebook',
      url,
      imageUrl,
      content: `Stolz präsentieren wir: ${project.title}

${project.description}

Mehr Details: ${url}`,
    },
    {
      platform: 'twitter',
      url,
      imageUrl,
      content: `✨ Neues Projekt: ${project.title}

${project.description.slice(0, 150)}...

${url}

#WebDesign #Portfolio`,
    },
  ];
}

/**
 * Simuliert das Posten (für Demo)
 * In Produktion: Ersetze mit echten API Calls
 */
async function postToSocialMedia(post: SocialPost): Promise<boolean> {
  console.log(`\n📱 Poste auf ${post.platform.toUpperCase()}:`);
  console.log(`   URL: ${post.url}`);
  console.log(`   Bild: ${post.imageUrl || 'Kein Bild'}`);
  console.log(`   Text:\n${post.content.split('\n').map(l => `   ${l}`).join('\n')}`);
  
  // TODO: Implementiere echte API Calls
  // Beispiele:
  
  // LinkedIn API
  // if (post.platform === 'linkedin') {
  //   const response = await fetch('https://api.linkedin.com/v2/ugcPosts', {
  //     method: 'POST',
  //     headers: {
  //       'Authorization': `Bearer ${process.env.LINKEDIN_ACCESS_TOKEN}`,
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({
  //       author: `urn:li:person:${process.env.LINKEDIN_PERSON_ID}`,
  //       lifecycleState: 'PUBLISHED',
  //       specificContent: {
  //         'com.linkedin.ugc.ShareContent': {
  //           shareCommentary: { text: post.content },
  //           shareMediaCategory: 'ARTICLE',
  //           media: [{
  //             status: 'READY',
  //             originalUrl: post.url,
  //           }],
  //         },
  //       },
  //       visibility: { 'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC' },
  //     }),
  //   });
  //   return response.ok;
  // }

  // Facebook API
  // if (post.platform === 'facebook') {
  //   const response = await fetch(
  //     `https://graph.facebook.com/v18.0/${process.env.FACEBOOK_PAGE_ID}/feed`,
  //     {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({
  //         message: post.content,
  //         link: post.url,
  //         access_token: process.env.FACEBOOK_ACCESS_TOKEN,
  //       }),
  //     }
  //   );
  //   return response.ok;
  // }

  // Twitter API (X)
  // if (post.platform === 'twitter') {
  //   // Nutze Twitter API v2 mit OAuth 2.0
  //   const response = await fetch('https://api.twitter.com/2/tweets', {
  //     method: 'POST',
  //     headers: {
  //       'Authorization': `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({ text: post.content }),
  //   });
  //   return response.ok;
  // }

  return true; // Simuliert Erfolg
}

/**
 * Hauptfunktion: Postet einen neuen Artikel auf allen Plattformen
 */
async function autoPostInsight(insightId: string): Promise<void> {
  console.log('🚀 Starte Auto-Posting für Artikel...\n');

  // Lade Artikel
  const insightPath = path.join(__dirname, `public/data/insights/${insightId}.json`);
  if (!fs.existsSync(insightPath)) {
    console.error(`❌ Artikel nicht gefunden: ${insightId}`);
    return;
  }

  const insight: Insight = JSON.parse(fs.readFileSync(insightPath, 'utf-8'));
  const baseUrl = process.env.SITE_URL || 'https://webstudio-ok.de';

  console.log(`📄 Artikel: ${insight.title}`);
  console.log(`🏷️  Tag: ${insight.tag}`);
  console.log(`📅 Datum: ${insight.date}\n`);

  // Generiere Posts
  const posts = generateInsightPosts(insight, baseUrl);

  // Poste auf allen Plattformen
  const results = await Promise.all(
    posts.map(async post => {
      try {
        const success = await postToSocialMedia(post);
        return { platform: post.platform, success };
      } catch (err) {
        console.error(`❌ Fehler beim Posten auf ${post.platform}:`, err);
        return { platform: post.platform, success: false };
      }
    })
  );

  // Zusammenfassung
  console.log('\n═══════════════════════════════════════════════════');
  console.log('📊 ERGEBNIS:');
  results.forEach(r => {
    const icon = r.success ? '✅' : '❌';
    console.log(`   ${icon} ${r.platform.toUpperCase()}`);
  });
  console.log('═══════════════════════════════════════════════════\n');
}

/**
 * Hauptfunktion: Postet ein neues Projekt auf allen Plattformen
 */
async function autoPostProject(projectId: string): Promise<void> {
  console.log('🚀 Starte Auto-Posting für Projekt...\n');

  // Lade Projekt
  const projectPath = path.join(__dirname, `public/data/projects/${projectId}.json`);
  if (!fs.existsSync(projectPath)) {
    console.error(`❌ Projekt nicht gefunden: ${projectId}`);
    return;
  }

  const project: Project = JSON.parse(fs.readFileSync(projectPath, 'utf-8'));
  const baseUrl = process.env.SITE_URL || 'https://webstudio-ok.de';

  console.log(`📁 Projekt: ${project.title}`);
  console.log(`🏷️  Kategorie: ${project.category}\n`);

  // Generiere Posts
  const posts = generateProjectPosts(project, baseUrl);

  // Poste auf allen Plattformen
  const results = await Promise.all(
    posts.map(async post => {
      try {
        const success = await postToSocialMedia(post);
        return { platform: post.platform, success };
      } catch (err) {
        console.error(`❌ Fehler beim Posten auf ${post.platform}:`, err);
        return { platform: post.platform, success: false };
      }
    })
  );

  // Zusammenfassung
  console.log('\n═══════════════════════════════════════════════════');
  console.log('📊 ERGEBNIS:');
  results.forEach(r => {
    const icon = r.success ? '✅' : '❌';
    console.log(`   ${icon} ${r.platform.toUpperCase()}`);
  });
  console.log('═══════════════════════════════════════════════════\n');
}

// CLI
const args = process.argv.slice(2);

if (args.length === 0) {
  console.log(`
╔═══════════════════════════════════════════════════╗
║       SOCIAL MEDIA AUTO-POSTING SYSTEM            ║
╚═══════════════════════════════════════════════════╝

Verwendung:
  npx tsx social-auto-post.ts insight <id>
  npx tsx social-auto-post.ts project <id>

Beispiele:
  npx tsx social-auto-post.ts insight ki-im-mittelstand
  npx tsx social-auto-post.ts project kraftwerk-digital

Unterstützte Plattformen:
  ✅ LinkedIn
  ✅ Facebook
  ✅ Twitter/X
  ✅ XING

Setup (.env):
  SITE_URL=https://webstudio-ok.de
  LINKEDIN_ACCESS_TOKEN=...
  LINKEDIN_PERSON_ID=...
  FACEBOOK_ACCESS_TOKEN=...
  FACEBOOK_PAGE_ID=...
  TWITTER_BEARER_TOKEN=...

Automatisierung:
  Füge zu package.json hinzu:
  "scripts": {
    "post:insight": "tsx social-auto-post.ts insight",
    "post:project": "tsx social-auto-post.ts project"
  }
  `);
  process.exit(0);
}

const [type, id] = args;

if (type === 'insight' && id) {
  autoPostInsight(id).catch(console.error);
} else if (type === 'project' && id) {
  autoPostProject(id).catch(console.error);
} else {
  console.error('❌ Ungültige Argumente');
  console.log('Nutze: npx tsx social-auto-post.ts insight <id>');
  console.log('   oder: npx tsx social-auto-post.ts project <id>');
  process.exit(1);
}
