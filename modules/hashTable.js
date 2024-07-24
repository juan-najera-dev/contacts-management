export class HashTable {
	values;
	numberOfValues;
	size;

	constructor(size) {
		this.values = {};
		this.numberOfValues = 0;
		this.size = size;
	}

	calculateHash(key) {
		return key.toString().length % this.size;
	}

	add(key, value) {
		const hash = this.calculateHash(key);
		if (!this.values.hasOwnProperty(hash)) {
			this.values[hash] = {};
		}
		if (!this.values[hash].hasOwnProperty(key)) {
			this.numberOfValues++;
		}
		this.values[hash][key] = value;
	}

	remove(key) {
		const hash = this.calculateHash(key);
		if (
			this.values.hasOwnProperty(hash) &&
			this.values[hash].hasOwnProperty(key)
		) {
			delete this.values[hash][key];
			this.numberOfValues--;
		}
	}

	search(key) {
		const hash = this.calculateHash(key);
		if (
			this.values.hasOwnProperty(hash) &&
			this.values[hash].hasOwnProperty(key)
		) {
			return this.values[hash][key];
		} else {
			return null;
		}
	}

	length() {
		return this.numberOfValues;
	}

	print() {
		let string = "";
		for (const value in this.values) {
			for (const key in this.values[value]) {
				string += `${this.values[value][key]} `;
			}
		}
		return string;
	}
}
