import * as base64 from './util/base64.js'

export default class Base64 extends HTMLElement {
	static get observedAttributes() {
		return ['unclosable', 'width', 'opened'];
	}
	constructor() {
		super();
		let shadow = this.attachShadow({mode:'open'});
		this._shadow = shadow;
		shadow.innerHTML = `
<style>
:host {
	display: flex;
	flex-direction: column;
	position: relative;
}
div {
	display: flex;
}
textarea {
	flex: 1;
	border: 1px #999 solid;
	resize: none;
}
button {
	flex: 1;
	height: 40px;
}
</style>
<textarea id="source" placeholder="要进行编码的文本..."></textarea>
<div class="main">
	<button id="encode">↓↓编码↓↓</button>
	<button id="decode">↑↑解码↑↑</button>
</div>
<textarea id="encoded" placeholder="要进行解码的 Base64 码..."></textarea>
		`
		const sourceText = shadow.getElementById('source');
		const encodedText = shadow.getElementById('encoded');
		shadow.getElementById('encode').addEventListener('click', _ => this.encode());
		shadow.getElementById('decode').addEventListener('click', _ => this.decode());
		
		this._sourceText = sourceText;
		this._encodedText = encodedText;
	}
	encode() {
		this._encodedText.value = base64.encode(this._sourceText.value);
	}
	decode() {
		this._sourceText.value = base64.decode(this._encodedText.value);
	}
	connectedCallback(...p){
		//插入
	}
	disconnectedCallback(...p){
		//移除
	}
	adoptedCallback(...p){
		//移动到其他文档中
	}
	attributeChangedCallback(attrName, oldVal, newVal, ...p){
		//属性值改变
		switch(attrName) {
			case 'width':
				newVal = Number(newVal);
				if (newVal > 0) {
					this._buttons.style.width = newVal + 'px';
				} else {
					delete this._buttons.style.width;
				}
				return;
			case 'opened':
				if (typeof newVal === 'string' !== this.opened) {
					this.opened ? this.close() : this.open;
				}
				return;
		}
	}
}