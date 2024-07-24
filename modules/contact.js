const photos = [
	"../assets/img/f01.png",
	"../assets/img/f02.png",
	"../assets/img/f03.png",
	"../assets/img/m01.png",
	"../assets/img/m02.png",
	"../assets/img/m03.png",
	"https://ionicframework.com/docs/img/demos/avatar.svg",
];

export class Contact {
	id;
	photo;
	name;
	phone;
	email;
	label;

	constructor(
		id = new Date().getTime().toString(),
		name,
		phone,
		email = "",
		label = "",
		photo = photos[Math.floor(Math.random() * photos.length)]
	) {
		this.id = id;
		this.photo = photo;
		this.name = name;
		this.phone = phone;
		this.email = email;
		this.label = label;
	}
}
