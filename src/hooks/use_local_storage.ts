import { useCallback } from "react";

export default function useLocalStorage({ key, initialValue }: { key: string, initialValue?: unknown }) {
	const ls = window.localStorage;
	const set = useCallback((newValue: unknown) => {
		ls.setItem(key, JSON.stringify(newValue || initialValue));
	}, [initialValue]);

	const get = useCallback(() => {
		const val = ls.getItem(key);
		return val === null ? initialValue : JSON.parse(val);
	}, [initialValue, key, ls]);

	return { get, set }
}