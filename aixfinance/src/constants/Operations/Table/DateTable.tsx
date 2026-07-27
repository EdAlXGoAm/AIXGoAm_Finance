import { Paragraph, TextLine, TextLineTwoLines } from "@/utils/textUtils";
import { toDateLocalString, toTimeLocalString } from "@/utils/dateUtils";

interface DateTableProps {
  date: Date;
  fontSize?: string;
}

const DateTable = ({ date, fontSize }: DateTableProps) => {
  return (
    <>
      <Paragraph>
        <TextLineTwoLines variable="Fecha" fontSize={fontSize}>
          {toDateLocalString(date)}
        </TextLineTwoLines>
        <TextLineTwoLines variable="Hora" fontSize={fontSize}>
          {toTimeLocalString(date)}
        </TextLineTwoLines>
      </Paragraph>
    </>
  );
}

export default DateTable;
