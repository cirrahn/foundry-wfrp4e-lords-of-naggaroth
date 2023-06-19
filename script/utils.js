import fs from "fs";
import path from "path";

export const getSlugged = (str) => {
	return str.trim().toLowerCase().replace(/[^\w ]+/g, "").replace(/ +/g, "-");
};

export const getRecursiveClean = (obj) => {
	if (obj == null) return undefined;

	if (typeof obj !== "object") return obj;
	if (obj instanceof Array) return obj.map(it => getRecursiveClean(it));

	const objClean = {};
	for (const [k, v] of Object.entries(obj)) {
		const nxt = getRecursiveClean(v);
		if (nxt !== undefined) objClean[k] = nxt;
	}
	if (Object.keys(objClean).length) return objClean;
	return undefined;
};

export const getDotPath = (obj, dotPath) => {
	if (!dotPath) return undefined;

	let target = obj;
	for (const p of dotPath.split(".")) {
		if (target == null || (typeof target !== "object")) return undefined;
		if (p in target) target = target[p];
		else return undefined;
	}
	return target;
};

export const setDotPath = (obj, dotPath, value) => {
	if (!dotPath) throw new Error(`No dotPath specified!`);

	const dotPathSpl = dotPath.split(".");
	const prop = dotPathSpl.at(-1);
	const rest = dotPathSpl.slice(0, -1);

	if (!rest.length) return obj[prop] = value;

	let target = obj;
	for (const p of rest) {
		target = (target[p] ||= {});
	}
	return target[prop] = value;
};

export const delDotPath = (obj, dotPath) => {
	const stack = [obj];
	const splitPath = dotPath.split(".");

	if (obj == null) return obj;
	for (let i = 0; i < splitPath.length - 1; ++i) {
		obj = obj[splitPath[i]];
		stack.push(obj);
		if (obj === undefined) return obj;
	}
	const out = delete obj[splitPath.at(-1)];

	for (let i = splitPath.length - 1; i > 0; --i) {
		if (!Object.keys(stack[i]).length) delete stack[i - 1][splitPath[i - 1]];
	}

	return out;
};

export const lsRecursiveSync = (dir) => {
	return fs.readdirSync(dir)
		.flatMap(file => {
			const pathNxt = path.join(dir, file);
			return fs.statSync(pathNxt).isDirectory()
				? lsRecursiveSync(pathNxt)
				: pathNxt;
		});
};
