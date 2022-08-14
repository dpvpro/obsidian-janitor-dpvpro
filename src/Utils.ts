export function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

export function partition<T>(array: T[], isValid: (el: T) => boolean) :T[][] {
	return array.reduce(([pass, fail]: any, elem: any) => {
		return isValid(elem) ? [[...pass, elem], fail] : [pass, [...fail, elem]];
	}, [[], []]);
}
