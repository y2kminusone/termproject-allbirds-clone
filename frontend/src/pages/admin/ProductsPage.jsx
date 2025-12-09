import { useMemo, useState } from "react";
import styled from "styled-components";
import { useAdminData } from "../../data/AdminDataContext";

const SectionTitle = styled.h2`
  margin: 0 0 12px;
  font-size: 22px;
`;

const Description = styled.p`
  margin: 0 0 20px;
  color: #4b5563;
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
    vertical-align: middle;
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

const Thumb = styled.img`
  width: 64px;
  height: 64px;
  border-radius: 10px;
  object-fit: cover;
  border: 1px solid #e5e7eb;
`;

const Button = styled.button`
  padding: 8px 12px;
  border-radius: 10px;
  border: 1px solid #111827;
  background: #111827;
  color: #ffffff;
  cursor: pointer;
  font-weight: 600;
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
`;

const ModalContent = styled.div`
  width: 440px;
  background: #ffffff;
  border-radius: 14px;
  padding: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.18);
`;

const ModalTitle = styled.h3`
  margin: 0 0 16px;
  font-size: 18px;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 14px;
`;

const Label = styled.label`
  font-weight: 700;
`;

const Input = styled.input`
  border: 1px solid #d1d5db;
  border-radius: 10px;
  padding: 10px;
  outline: none;
  transition: border-color 0.2s ease;

  &:focus {
    border-color: #111827;
  }
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 8px;
`;

const GhostButton = styled.button`
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid #d1d5db;
  background: #ffffff;
  cursor: pointer;
  font-weight: 600;
`;

const ChipList = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
`;

const Chip = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #111827;
  color: #ffffff;
  border-radius: 999px;
  padding: 8px 10px;
  font-weight: 700;
  font-size: 13px;
`;

const ChipRemove = styled.button`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.18);
  color: #ffffff;
  font-weight: 700;
  cursor: pointer;
  display: grid;
  place-items: center;
  transition: background 0.2s ease, transform 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.32);
    transform: scale(1.02);
  }
`;

const AddSizeButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border-radius: 999px;
  border: 1px dashed #9ca3af;
  background: #f9fafb;
  color: #111827;
  font-weight: 700;
  cursor: pointer;

  &:hover {
    border-color: #111827;
    background: #eef2ff;
  }
`;

const Helper = styled.span`
  color: #6b7280;
  font-size: 13px;
`;

const PopOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 11;
`;

const PopCard = styled.div`
  width: 320px;
  background: #ffffff;
  border-radius: 12px;
  padding: 18px;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.18);
`;

const PopTitle = styled.h4`
  margin: 0 0 12px;
  font-size: 16px;
`;

const PopActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 10px;
`;

export default function ProductsPage() {
  const { products, updateProduct } = useAdminData();
  const [selected, setSelected] = useState(null);
  const [sizesList, setSizesList] = useState([]);
  const [discountInput, setDiscountInput] = useState("0");
  const [isSizeModalOpen, setIsSizeModalOpen] = useState(false);
  const [newSize, setNewSize] = useState("");

  const handleOpen = (product) => {
    setSelected(product);
    setSizesList(product.sizes);
    setDiscountInput(String(Math.round(product.discountRate * 100)));
    setIsSizeModalOpen(false);
  };

  const handleRemoveSize = (size) => {
    setSizesList((prev) => prev.filter((entry) => entry !== size));
  };

  const handleAddSize = () => {
    const trimmed = newSize.trim();
    if (!trimmed) return;
    setSizesList((prev) => (prev.includes(trimmed) ? prev : [...prev, trimmed]));
    setNewSize("");
    setIsSizeModalOpen(false);
  };

  const handleSave = () => {
    if (!selected) return;
    const parsedDiscount = Number(discountInput);
    const discountRate = Number.isFinite(parsedDiscount)
      ? Math.min(Math.max(parsedDiscount, 0), 90) / 100
      : 0;

    updateProduct(selected.id, { sizes: sizesList, discountRate });
    setSelected(null);
    setIsSizeModalOpen(false);
  };

  const rows = useMemo(
    () =>
      products.map((product) => ({
        ...product,
        discounted: product.price * (1 - product.discountRate),
      })),
    [products],
  );

  return (
    <div>
      <SectionTitle>상품 관리</SectionTitle>
      <Description>목록에서 가용사이즈와 할인율을 바로 수정할 수 있습니다.</Description>
      <Table>
        <thead>
          <tr>
            <th>썸네일</th>
            <th>상품명</th>
            <th>카테고리</th>
            <th>가격</th>
            <th>할인율</th>
            <th>할인가</th>
            <th>가용사이즈</th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((product) => (
            <tr key={product.id}>
              <td>
                <Thumb src={product.thumbnail} alt={product.name} />
              </td>
              <td>{product.name}</td>
              <td>{product.category}</td>
              <td>{product.price.toLocaleString()}원</td>
              <td>{Math.round(product.discountRate * 100)}%</td>
              <td>{Math.round(product.discounted).toLocaleString()}원</td>
              <td>{product.sizes.join(", ")}</td>
              <td>
                <Button onClick={() => handleOpen(product)}>수정</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {selected && (
        <ModalOverlay>
          <ModalContent>
            <ModalTitle>{selected.name} 수정</ModalTitle>
            <Field>
              <Label htmlFor="sizes">가용사이즈</Label>
              <ChipList>
                {sizesList.map((size) => (
                  <Chip key={size}>
                    {size}
                    <ChipRemove type="button" onClick={() => handleRemoveSize(size)}>
                      ×
                    </ChipRemove>
                  </Chip>
                ))}
                <AddSizeButton type="button" onClick={() => setIsSizeModalOpen(true)}>
                  + 사이즈 추가
                </AddSizeButton>
              </ChipList>
              <Helper>동그란 뱃지 안의 X로 삭제하고, + 버튼으로 추가하세요.</Helper>
            </Field>
            <Field>
              <Label htmlFor="discount">할인율 (%)</Label>
              <Input
                id="discount"
                type="number"
                min="0"
                max="90"
                value={discountInput}
                onChange={(e) => setDiscountInput(e.target.value)}
              />
            </Field>
            <ModalActions>
              <GhostButton
                onClick={() => {
                  setSelected(null);
                  setIsSizeModalOpen(false);
                }}
              >
                취소
              </GhostButton>
              <Button onClick={handleSave}>저장</Button>
            </ModalActions>
          </ModalContent>
          {isSizeModalOpen && (
            <PopOverlay>
              <PopCard>
                <PopTitle>사이즈 추가</PopTitle>
                <Input
                  autoFocus
                  value={newSize}
                  onChange={(e) => setNewSize(e.target.value)}
                  placeholder="예: 250"
                />
                <PopActions>
                  <GhostButton type="button" onClick={() => setIsSizeModalOpen(false)}>
                    닫기
                  </GhostButton>
                  <Button type="button" onClick={handleAddSize}>
                    추가
                  </Button>
                </PopActions>
              </PopCard>
            </PopOverlay>
          )}
        </ModalOverlay>
      )}
    </div>
  );
}
