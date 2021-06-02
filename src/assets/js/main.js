import '@/sass/app.scss';

import TellUsMore from './contact';
import Overlay from './overlay';
import InView from './in-view';
import LogoAnimation from './logo-animation';

require('intersection-observer');

const overlay = new Overlay();
overlay.init();

const inView = new InView();
inView.init();

const logoAnimation = new LogoAnimation();
logoAnimation.init();

const contactSubmission = new TellUsMore();
contactSubmission.init();
