import { createApp } from 'vue'
import {App} from './App'
import {router} from './router'
import './style.css'
import "flatpickr/dist/flatpickr.min.css"; // 引入flatpickr样式
import flatpickr from 'flatpickr';
import lang from "flatpickr/dist/l10n/zh";

flatpickr.localize(lang.zh!);

createApp(App).use(router).mount('#app')
