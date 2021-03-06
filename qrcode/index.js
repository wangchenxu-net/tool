/**
 * @name Qrcode 二维码生成器
 * @description 可以生成文本、网址等的二维码
 */

import {generateThemeStyle} from '../index.js';
import createQrcodeMap from '../util/qrcode.js'

export default class Qrcode extends HTMLElement {
	constructor() {
		super();
		let shadow = this.attachShadow({mode:'open'});
		this._shadow = shadow;
		shadow.innerHTML = `
<style>
	:host { display: flex; flex-direction: column; --width: 120px; position: relative; }
	.main { display: flex; flex: 1;  height: calc(100% - 40px);}
	.main > * { overflow: auto; }
	textarea{ resize: none; line-height: 1.5!important;}
	label { white-space:nowrap; }
	* { box-sizing: border-box; margin: 0; }
	#selector { height: 40px; white-space:nowrap; background: #51AEFF; overflow: auto;}
	#selector span { display: inline-block; background: #FFF; height: 30px; padding: 5px; border-radius: 5px; margin: 5px 2px; line-height: 20px; color: #08F; }
	#selector span.select { background: #08F; color: #FFF; }
	form { flex: 1; display: none; flex-direction: column; }
	form.select { display: flex; }
	form > * { margin: 2px auto; max-width: 800px; width: 95%; display: flex; min-height: 30px; line-height: 30px; }
	form > button { margin: 10px auto; display: inline-block; max-width: 200px; width: 100%; text-align: center; }
	form input, form select { flex: 1; }
	main { flex: 1; display: flex; flex-direction: column; }
	#info { width: var(--width); display: flex; flex-direction: column; overflow: auto}
	#info label { display: flex; height: 30px; line-height: 30px; font-size: 16px; }
	#info input[type=color], #info input[type=number], #info select  { flex: 1; height: 30px; box-sizing: border-box; margin: 0; width: 60px; line-height: 30px; }
	#info button { height: 30px; box-sizing: border-box; margin: 0; line-height: 30px; }
	canvas { width: var(--width); height: var(--width); }
	@media (min-width:600px) { :host { --width: 180px; } }
	@media (min-width:800px) { :host { --width: 240px; } }
	@media (min-width:1000px) { :host { --width: 300px; } }
	#showLayer { display: none; position: absolute; top: 0; left: 0; right: 0; bottom: 0; }
	#showLayer img { position: absolute; top: 0; left: 0; right: 0; bottom: 0; margin: auto; max-width: 90%; max-height: 90%; }
	input, button { border: 1px solid; }
	${generateThemeStyle(':host')}
	${generateThemeStyle('button', 'button')}
	${generateThemeStyle('input', 'input')}
	${generateThemeStyle('textarea', 'input')}
	${generateThemeStyle('select', 'input')}
	${generateThemeStyle('#showLayer', 'mask')}
</style>
<div id="selector">
	<span data-type-id="text">文本</span>
	<span data-type-id="url">网址</span>
	<span data-type-id="vcard">名片</span>
	<span data-type-id="wifi">WIFI</span>
</div>
<div class="main">
	<main>
		<form data-type-id="text">
			<input name="type" value="text" type="hidden" />
			<textarea name="text" rows="10" required placeholder="要生成二维码的文本，必填" ></textarea>
			<button type="submit">生成二维码</button>
		</form>
		<form data-type-id="url">
			<input name="type" value="text" type="hidden" />
			<label>URL:<input  name="text" type="url" required placeholder="要生成二维码的URL，必填" /></label>
			<button type="submit">生成二维码</button>
		</form>
		<form data-type-id="vcard">
			<input name="type" value="vcard" type="hidden" />
			<label>个人信息:</label>
			<label>姓名:<input name="fullname" type="text" required placeholder="姓名，必填" /></label>
			<label>称呼:<input name="nickname" type="text" placeholder="称呼或者昵称"/></label>
			<label>手机:<input name="mytel" type="tel" placeholder="个人的联系电话" /></label>
			<label>邮箱:<input name="myemail" type="email" placeholder="个人的联系电话" /></label>
			<label>网站:<input name="myurl" type="url" placeholder="个人网站、博客" /></label>
			<label>地址:<input name="myadr" type="text" placeholder="家庭住址" /></label>
			<label>工作信息:</label>
			<label>公司:<input name="org" type="text" placeholder="公司或者所在组织名称" /></label>
			<label>职位:<input name="worktitle" type="text" placeholder="担任的职位" /></label>
			<label>电话:<input name="worktel" type="tel" placeholder="工作时的联系电弧" /></label>
			<label>传真:<input name="workfax" type="tel" placeholder="工作地点的传真" /></label>
			<label>邮箱:<input name="workemail" type="email" placeholder="工作邮箱" /></label>
			<label>网站:<input name="workurl" type="url" placeholder="公司网站" /></label>
			<label>地址:<input name="workadr" type="text" placeholder="工作地点" /></label>
			<button type="submit">生成二维码</button>
		</form>
		<form data-type-id="wifi">
			<input name="type" value="wifi" type="hidden" />
			<label>WiFi名称:<input name="S" type="text" required placeholder="WiFi的名称，必填" /></label>
			<label>加密方式:<select name="T">
				<option value="">不加密(无密码)/自动识别</option>
				<option value="WPA">WPA</option>
				<option value="WPA2">WPA2</option>
			</select></label>
			<label>WiFi密码:<input name="P" type="text" placeholder="WiFi的密码，当加密方式为 WPA 或 WPA2 时必填" /></label>
			<button type="submit">生成二维码</button>
		</form>
	</main>
	<div id="info">
		<canvas></canvas>
		<label>前景色<input name="color" type="color" value="#000000" /></label>
		<label>背景色<input name="bgcolor" type="color" value="#FFFFFF"/></label>
		<label>大　小<input name="size" type="number" min="200" max="1000" value="360" /></label>
		<label>容　错<select name="level">
			<option value="1">7%</option>
			<option value="2" selected>15%</option>
			<option value="3">25%</option>
			<option value="4">30%</option>
		</select></label>
		<label>类　型<select name="mime">
			<option value="image/png">png</option>
			<option value="image/jpeg">jpg</option>
			<option value="image/webp">webp</option>
			<option value="image/svg+xml">svg</option>
		</select></label>
		<button id="show">查看二维码</button>
		<button id="download">下载二维码</button>
	</div>
</div>
<div id="showLayer"></div>
`;
		this._canvas = shadow.querySelector('canvas')

		Array.from(shadow.querySelectorAll('form'))
			.forEach(form => form.addEventListener('submit', (event) => {
				event.preventDefault();
				let data = '';
				switch(form.type.value) {
					case 'text': 
						data = form.text.value;
						break;
					case 'wifi': {
						const {S: {value: S}, T: {value: T}, P: {value: P}} = form;
						if (!S) {
							return alert(`请填写WiFi名称`);
						}
						if (T && !P) {
							return alert(`请填写WiFi密码`);
						}
						data = `WIFI:S:${S};${T ?`T:${T};`:''}${P ?`P:${P};`:''}`;
						break;
					}
					case 'vcard': {
						data = [
							'BEGIN:VCARD',
							'VERSION:3.0',
							form.fullname.value ? `FN:${form.fullname.value}` : '',
							form.nickname.value ? `NICKNAME:${form.nickname.value}` : '',
							form.mytel.value ? `TEL;TYPE=CELL:${form.mytel.value}` : '',
							form.myemail.value ? `EMAIL;TYPE=HOME:${form.myemail.value}` : '',
							form.myurl.value ? `URL;TYPE=HOME:${form.myurl.value}` : '',
							form.myadr.value ? `ADR;TYPE=HOME:${form.myadr.value}` : '',
							form.org.value ? `ORG:${form.org.value}` : '',
							form.worktitle.value ? `TITLE:${form.worktitle.value}` : '',
							form.worktel.value ? `TEL;TYPE=WORK:${form.worktel.value}` : '',
							form.workfax.value ? `TEL;TYPE=WORK;TYPE=FAX:${form.workfax.value}` : '',
							form.workemail.value ? `EMAIL;TYPE=WORK:${form.workemail.value}` : '',
							form.workurl.value ? `URL;TYPE=WORK:${form.workurl.value}` : '',
							form.workadr.value ? `ADR;TYPE=WORK:${form.workadr.value}` : '',
							'END:VCARD',
						].filter(Boolean).join('\n');
					}
					break;
				}
				if (!data) { return; }
				this.create(data);
			}));

		let opt = {};
		Array.from(shadow.querySelectorAll('#info input, #info select'))
			.forEach(it => Reflect.defineProperty(opt, it.name, { get() { return it.value; }, set(v) { it.value = v; } }));
		this._opt = opt;


		shadow.querySelector('#show').addEventListener('click', e => this.show())
		shadow.querySelector('#download').addEventListener('click', e => this.download())
		shadow.querySelector('#showLayer').addEventListener('click', function (e){
			if (e.path[0] !== this) { return; }
			this.innerHTML = '';
			this.style.display = 'none';
		})

		Array.from(shadow.querySelectorAll('span[data-type-id]'))
		.forEach(it => it.addEventListener('click', (event) => {this.type = it.dataset.typeId;}));
		Array.from(shadow.querySelectorAll('#info input, #info select'))
		.forEach(it => it.addEventListener('change', (event) => this.update()));
		this.type = 'text';
		this._level = this._opt.level;

		

		this._canvas.width = 240;
		this._canvas.height = 240;
		const ctx = this._canvas.getContext('2d');
		ctx.fillStyle = "#999";
		ctx.textAlign = 'center';
		ctx.font = "32px sans-serif";
		ctx.fillText("此处显示", 120, 100)
		ctx.fillText("生成的二维码", 120, 140)
	}
	set type(type) {
		this._type = type;
		Array.from(this._shadow.querySelectorAll('[data-type-id]'))
		.forEach(it => it.dataset.typeId === type ? it.classList.add('select') : it.classList.remove('select'));
	}
	get type() {
		return this._type;
	}
	create(str) {
		this._str = str;
		this._map = createQrcodeMap(str, this._level);
		this.update();
	}
	update() {
		if(!this._map) { return; }
		let map = this._map;
		let { size, color, bgcolor, level } = this._opt;
		level = Number(level);
		if (this._level !== level) {
			this._level = level;
			map = this._map = createQrcodeMap(this._str, this._level);
		}
		const length = Math.sqrt(map.length);
		let width = Math.floor(size / (length + 2));
		if (width === 0) {
			width = 1;
			size = length + 2;
			this._opt.size = size;
		}
		const margin = Math.floor((size - length * width) / 2);

		this._canvas.width = size;
		this._canvas.height = size;
		const ctx = this._canvas.getContext('2d');
		ctx.fillStyle = bgcolor;
		ctx.fillRect(0, 0, size, size);
		ctx.fillStyle = color;
		for (let i = 0; i < length; i++) {
			for (let j = 0; j < length; j++) {
				if (map[i * length + j]) {
					ctx.fillRect(margin + i * width, margin + j * width, width, width);
				}
			}
		}
	}
	show() {
		if(!this._map) { return alert(`请先生成二维码`); }
		const showLayer = this._shadow.querySelector('#showLayer');
		const image = new Image();
		image.src = this.getUri();
		showLayer.appendChild(image);
		showLayer.style.display = 'block';
	}
	download() {
		if(!this._map) { return alert(`请先生成二维码`); }
		const a = document.createElement('a');
		a.href = this.getUri();
		a.download = '二维码';
		return a.click();
	}
	getUri() {
		if(!this._map) { return alert(`请先生成二维码`); }
		let {mime} = this._opt;
		const data = [];
		if (mime === 'image/svg+xml') {
			data.push(this.svg());
		} else {
			const uri = this._canvas.toDataURL(mime);
			let base;
			[mime, base] = uri.replace(/^data:/, '').split(/\s*;\s*base64\s*,\s*/);
			const str = atob(base);
			const sliceSize = 512;
			for (let offset = 0; offset < str.length; offset += sliceSize) {
				const chars = str.slice(offset, offset + sliceSize);
				const ua = new Uint8Array(chars.length);
				for (let i = 0; i < chars.length; i++) {
					ua[i] = chars.charCodeAt(i);
				}
				data.push(ua);
			}
		}
		return URL.createObjectURL(new Blob(data, {type: mime}));
	}
	svg() {
		if(!this._map) { return alert(`请先生成二维码`); }
		let map = this._map;
		const path = [];
		const length = Math.sqrt(map.length);
		const width = 8;
		const margin = length * width / 2;
		for (let i = 0; i < length; i++) {
			for (let j = 0; j < length; j++) {
				if (map[i * length + j]) {
					path.push(`M${-margin + i * width} ${-margin + j * width} h${width} v${width} h${-width} Z`)
				}
			}
		}
		const translate = margin + width * 2;
		let { size, color, bgcolor } = this._opt;
		return `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
		<svg viewBox="0 0 ${2 * translate} ${2 * translate}" width="${size}" height="${size}" version="1.1" xmlns="http://www.w3.org/2000/svg">
			<path fill="${bgcolor}" d="M 0 0 H ${2 * translate} V ${2 * translate} H 0 Z"></path>
			<path transform="translate(${translate}, ${translate})" fill="${color}" d="${path.join('\n')}"></path>
		</svg>`
	}
}
