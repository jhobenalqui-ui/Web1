import {subscribe,setState} from './core/store.js';
import {documentsService} from './services/documents.service.js';
import {authService} from './services/auth.service.js';
import {contentService} from './services/content.service.js';
import {initLogin} from './features/auth/login.js';
import {initShell,renderShell} from './features/shell/shell.js';
import {initFeed,renderFeed} from './features/documents/feed.js';
import {initUploadModal} from './features/documents/upload-modal.js';
import {initSections,renderSection} from './features/community/sections.js';
import {renderProfile} from './features/profile/profile-panel.js';

initLogin();initShell();initFeed();initUploadModal();initSections();
subscribe(s=>{renderShell(s);renderFeed(s);renderSection(s);renderProfile(s)});
const user=await authService.restore();
setState({docs:await documentsService.list(),users:await authService.list(),...await contentService.list(),
  ...(user?{user,screen:'app',view:user.role==='admin'?'r:admin':'r:page'}:{})});
