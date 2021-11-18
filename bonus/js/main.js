new Vue({
	el: "#app",
	data: {
		user: {
			name: "Luigi",
			avatar: "_io",
		},
		contacts: [
			{
				name: "Michele",
				avatar: "_1",
				visible: true,
				messages: [
					{
						date: "10/01/2020 15:30:55",
						text: "Hai portato a spasso il cane?",
						status: "sent",
					},
					{
						date: "10/01/2020 15:50:00",
						text: "Ricordati di dargli da mangiare",
						status: "sent",
					},
					{
						date: "10/01/2020 16:15:22",
						text: "Tutto fatto!",
						status: "received",
					},
				],
			},
			{
				name: "Fabio",
				avatar: "_2",
				visible: true,
				messages: [
					{
						date: "20/03/2020 16:30:00",
						text: "Ciao come stai?",
						status: "sent",
					},
					{
						date: "20/03/2020 16:30:55",
						text: "Bene grazie! Stasera ci vediamo?",
						status: "received",
					},
					{
						date: "20/03/2020 16:35:00",
						text: "Mi piacerebbe ma devo andare a fare la spesa.",
						status: "sent",
					},
				],
			},
			{
				name: "Samuele",
				avatar: "_3",
				visible: true,
				messages: [
					{
						date: "28/03/2020 10:10:40",
						text: "La Marianna va in campagna",
						status: "received",
					},
					{
						date: "28/03/2020 10:20:10",
						text: "Sicuro di non aver sbagliato chat?",
						status: "sent",
					},
					{
						date: "28/03/2020 16:15:22",
						text: "Ah scusa!",
						status: "received",
					},
				],
			},
			{
				name: "Luisa",
				avatar: "_4",
				visible: true,
				messages: [
					{
						date: "10/01/2020 15:30:55",
						text: "Lo sai che ha aperto una nuova pizzeria?",
						status: "sent",
					},
					{
						date: "10/01/2020 15:50:00",
						text: "Si, ma preferirei andare al cinema",
						status: "received",
					},
				],
			},
		],
		contextOptions: ["Message Info", "Delete message"],
		message: "",
		isBotTalk: true,
		userActiveIndex: 0,
		selectedUser: null,
		searchUserString: "",
		actualTargetIndex: 0,
		currentBubbleActive: null,
		isShowContextMenu: false,

		lastTimeOnline: "",
	},
	created() {
		this.userSelect(0);
		this.getLastTimeOnline();
		this.autoScollToBottom(0);
		dayjs.extend(dayjs_plugin_customParseFormat);
	},
	computed: {},
	methods: {
		userSelect(index) {
			this.userActiveIndex = index;
			this.selectedUser = this.contacts[this.userActiveIndex];

			this.getLastTimeOnline();
		},
		formatDate(string) {
			const today = new dayjs(string, "DD-MM-YYYY HH:mm:ss");
			return today.format("HH:mm");
		},
		botReply(timeForReply, arrayOfMessages) {
			setTimeout(() => {
				arrayOfMessages.push({
					date: dayjs().format("DD-MM-YYYY HH:mm:ss"),
					text: this.botMessage(),
					status: "received",
				});
			}, timeForReply);
			this.autoScollToBottom(1001);
		},
		botMessage() {
			const messages = ["Sono un Bot", "Ok", "Ciao", "Grazie", "Bye"];
			this.getLastTimeOnline();
			return messages[Math.floor(Math.random() * messages.length)];
		},
		sendMessage() {
			const { messages } = this.selectedUser;
			if (this.message.trim() !== "") {
				messages.push({
					date: dayjs().format("DD-MM-YYYY HH:mm:ss"),
					text: this.message,
					status: "sent",
				});
				this.message = "";
				this.autoScollToBottom(0);
				if (this.isBotTalk) this.botReply(1000, messages);
			} else {
				this.message = "";
			}
		},
		autoScollToBottom(timer) {
			setTimeout(() => {
				this.$refs.messageList.scrollTop = this.$refs.messageList.scrollHeight - this.$refs.messageList.clientHeight;
			}, timer);
		},
		/* TODO: creare la navigazione con le freccie e visualizzare sempre la pagina del primo contatto alla ricerca */
		searchUser() {
			this.contacts.filter((contact) => (contact.name.toLowerCase().match(this.searchUserString.toLowerCase()) ? (contact.visible = true) : (contact.visible = false)));
		},
		showButtonMenu(index) {
			// if (this.isShowContextMenu && this.actualTargetIndex !== index) return;
			this.actualTargetIndex = index;
		},
		hideButtonMenu(index) {
			if (this.isShowContextMenu) return;
			else {
				this.actualTargetIndex = null;
				this.isShowContextMenu = false;
			}
		},
		toggleContextMenu(event) {
			this.currentBubbleActive = event.target.parentElement;
			this.isShowContextMenu = !this.isShowContextMenu;
		},
		handleClick(evt) {
			if (this.isShowContextMenu && this.currentBubbleActive !== null && !this.currentBubbleActive.contains(evt.target)) {
				this.actualTargetIndex = null;
				this.isShowContextMenu = false;
			}
		},
		deleteMessage(index) {
			const { messages } = this.selectedUser;
			messages.splice(index, 1);
			this.actualTargetIndex = null;
			this.isShowContextMenu = false;
		},
		showMessageInfo(index) {
			const { messages } = this.selectedUser;
			console.log(`${messages[index].status === "sent" ? "Sent in date:" : "Received in date:"}`, messages[index].date, `Message:`, messages[index].text);
		},
		selectOption(index, actualTargetIndex) {
			index == 1 ? this.deleteMessage(actualTargetIndex) : this.showMessageInfo(actualTargetIndex);
			this.isShowContextMenu = false;
		},
		getLastTimeOnline() {
			this.contacts.forEach((contact) => {
				const { messages } = contact;
				const r = messages.filter((message) => message.status === "received");
				this.lastTimeOnline = r[r.length - 1].date.match(/(([0-2][0-9])(:)([0-5][0-9]))((;)([0-2][0-9])(:)([0-5][0-9]))*/g)[0];
				contact["lastLog"] = this.lastTimeOnline;
			});
		},
	},
});
