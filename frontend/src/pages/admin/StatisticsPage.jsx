import { useMemo, useState } from "react";
import styled from "styled-components";
import { useAdminData } from "../../data/AdminDataContext";

const SectionTitle = styled.h2`
  margin: 0 0 12px;
  font-size: 22px;
`;

const Description = styled.p`
  margin: 0 0 18px;
  color: #4b5563;
`;

const Filters = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  flex-wrap: wrap;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.label`
  font-weight: 700;
  color: #111827;
`;

const Input = styled.input`
  border: 1px solid #d1d5db;
  border-radius: 10px;
  padding: 10px;
  outline: none;

  &:focus {
    border-color: #111827;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;

  th,
  td {
    padding: 12px 14px;
    text-align: left;
    border-bottom: 1px solid #e5e7eb;
  }

  th {
    background: #f3f4f6;
    font-weight: 700;
    font-size: 14px;
  }

  tr:last-child td {
    border-bottom: none;
  }
`;

export default function StatisticsPage() {
  const { getStatistics } = useAdminData();
  const [startDate, setStartDate] = useState("2025-10-01");
  const [endDate, setEndDate] = useState("2025-12-31");

  const stats = useMemo(
    () => getStatistics({ startDate, endDate }),
    [getStatistics, startDate, endDate],
  );

  return (
    <div>
      <SectionTitle>판매 현황</SectionTitle>
      <Description>기간을 지정하여 제품별 판매수량과 매출을 확인합니다.</Description>

      <Filters>
        <Field>
          <Label htmlFor="start">시작일</Label>
          <Input
            id="start"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </Field>
        <Field>
          <Label htmlFor="end">종료일</Label>
          <Input id="end" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </Field>
      </Filters>

      <Table>
        <thead>
          <tr>
            <th>상품명</th>
            <th>카테고리</th>
            <th>판매수량</th>
            <th>매출(할인 적용)</th>
          </tr>
        </thead>
        <tbody>
          {stats.map((entry) => (
            <tr key={entry.product.id}>
              <td>{entry.product.name}</td>
              <td>{entry.product.category}</td>
              <td>{entry.units}개</td>
              <td>{entry.revenue.toLocaleString()}원</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
