export namespace Table {
	export interface Pageable {
		pageIndex: number;
		pageSize: number;
		total: number;
	}
	export interface TableStateProps {
		tableData: any[];
		pageable: Pageable;
		isShowPage:boolean;
		searchParam: {
			[key: string]: any;
		};
		searchInitParam: {
			[key: string]: any;
		};
		totalParam: {
			[key: string]: any;
		};
		icon?: {
			[key: string]: any;
		};
	}
}

export namespace HandleData {
	export type MessageType = "" | "success" | "warning" | "info" | "error";
}
