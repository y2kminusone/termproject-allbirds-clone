import { useEffect, useMemo, useState } from "react";
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

const QueryButton = styled.button`
  align-self: flex-end;
  padding: 10px 14px;
  border-radius: 10px;
  border: 1px solid #111827;
  background: #111827;
  color: #ffffff;
  font-weight: 700;
  cursor: pointer;
`;

const defaultRange = () => {
  const today = new Date();
  const format = (date) => date.toISOString().slice(0, 10);
  return {
    start: "2025-01-01",
    end: format(today),
  };
};

export default function StatisticsPage() {
  const { getStatistics } = useAdminData();
  const initialRange = useMemo(() => defaultRange(), []);
  const [startDate, setStartDate] = useState(initialRange.start);
  const [endDate, setEndDate] = useState(initialRange.end);
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [summary, setSummary] = useState({ totalUnits: 0, totalRevenue: 0 });

  const fetchStats = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getStatistics({ startDate, endDate });
      setSales(data.sales || data || []);
      if (data.summary) {
        setSummary({
          totalUnits: data.summary.totalUnits ?? 0,
          totalRevenue: data.summary.totalRevenue ?? 0,
        });
      } else {
        const agg = (data.sales || data || []).reduce(
          (acc, entry) => {
            acc.totalUnits += entry.units || 0;
            acc.totalRevenue += entry.revenue || 0;
            return acc;
          },
          { totalUnits: 0, totalRevenue: 0 },
        );
        setSummary(agg);
      }
    } catch (err) {
      const message = err.response?.data?.message || "판매 현황을 불러오지 못했습니다.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // 최초 진입 시 1년 범위로 한 번 조회
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <SectionTitle>판매 현황</SectionTitle>
      <Description>
        기간을 지정하여 제품별 판매수량과 매출을 확인합니다.
        {error ? ` (${error})` : ""}
      </Description>

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
        <QueryButton type="button" onClick={fetchStats} disabled={loading}>
          {loading ? "조회 중..." : "조회"}
        </QueryButton>
      </Filters>

      {loading && <Description>판매 현황을 불러오는 중입니다...</Description>}
      {!loading && (
        <Description>
          총 판매수량: {summary.totalUnits}개 / 총 매출: {summary.totalRevenue.toLocaleString()}원
        </Description>
      )}
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
          {sales.map((entry) => {
            const category = entry.categoryName || entry.categoryCode || "-";
            return (
              <tr key={entry.productId}>
                <td>{entry.name}</td>
                <td>{category}</td>
                <td>{entry.units}개</td>
                <td>{entry.revenue.toLocaleString()}원</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
}
