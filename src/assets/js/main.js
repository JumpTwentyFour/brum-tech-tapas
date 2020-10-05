import '@/sass/app.scss';

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
