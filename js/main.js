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
	},
	created() {
		this.userSelect(0);
		this.autoScollToBottom(0);
		dayjs.extend(dayjs_plugin_customParseFormat);
	},
	computed: {},
	methods: {
		userSelect(index) {
			this.userActiveIndex = index;
			this.selectedUser = this.contacts[this.userActiveIndex];
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
	},
});
