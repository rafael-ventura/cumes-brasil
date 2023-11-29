import { IndexQueryBase } from "./IndexQueryBase";
export declare abstract class IndexQueryWithParameters<T> extends IndexQueryBase<T> {
    skipDuplicateChecking: boolean;
}
