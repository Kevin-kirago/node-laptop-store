module.exports = (productHtml, laptopData) => {
	let output = productHtml.replace(/{%PRODUCTNAME%}/g, laptopData.productName);
	output = output.replace(/{%IMAGE%}/g, laptopData.image);
	output = output.replace(/{%PRICE%}/g, laptopData.price);
	output = output.replace(/{%SCREEN%}/g, laptopData.screen);
	output = output.replace(/{%CPU%}/g, laptopData.cpu);
	output = output.replace(/{%ID%}/g, laptopData.id);
	output = output.replace(/{%RAM%}/g, laptopData.ram);
	output = output.replace(/{%STORAGE%}/g, laptopData.storage);
	output = output.replace(/{%DESCRIPTION%}/g, laptopData.description);

	return output;
};
