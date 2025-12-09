import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useAdminData } from "../../data/AdminDataContext";

const SectionTitle = styled.h2`
  margin: 0 0 12px;
  font-size: 22px;
`;

const Description = styled.p`
  margin: 0 0 24px;
  color: #4b5563;
`;

const Form = styled.form`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 18px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  padding: 20px;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.label`
  font-weight: 700;
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

const TextArea = styled.textarea`
  border: 1px solid #d1d5db;
  border-radius: 10px;
  padding: 10px;
  min-height: 120px;
  resize: vertical;
  outline: none;

  &:focus {
    border-color: #111827;
  }
`;

const Submit = styled.button`
  grid-column: 1 / -1;
  padding: 12px;
  border-radius: 10px;
  border: none;
  background: #111827;
  color: #ffffff;
  font-weight: 700;
  cursor: pointer;
  margin-top: 6px;
`;

const Helper = styled.span`
  color: #6b7280;
  font-size: 13px;
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

const PopOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 20;
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

const GhostButton = styled.button`
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid #d1d5db;
  background: #ffffff;
  cursor: pointer;
  font-weight: 600;
`;

const PrimaryButton = styled.button`
  padding: 10px 12px;
  border-radius: 10px;
  border: none;
  background: #111827;
  color: #ffffff;
  cursor: pointer;
  font-weight: 700;
`;

export default function NewProductPage() {
  const { addProduct } = useAdminData();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    summary: "",
    price: "",
    category: "라이프스타일",
    sizes: ["250", "255", "260"],
    discountRate: "0",
  });
  const [imageFile, setImageFile] = useState(null);
  const [isSizeModalOpen, setIsSizeModalOpen] = useState(false);
  const [newSize, setNewSize] = useState("");

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleRemoveSize = (size) => {
    setForm((prev) => ({
      ...prev,
      sizes: prev.sizes.filter((entry) => entry !== size),
    }));
  };

  const handleAddSize = () => {
    const trimmed = newSize.trim();
    if (!trimmed) return;

    setForm((prev) => {
      if (prev.sizes.includes(trimmed)) return prev;
      return { ...prev, sizes: [...prev.sizes, trimmed] };
    });
    setNewSize("");
    setIsSizeModalOpen(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const price = Number(form.price) || 0;
    const thumbnail = imageFile ? URL.createObjectURL(imageFile) : undefined;
    const parsedDiscount = Number(form.discountRate);
    const discountRate = Number.isFinite(parsedDiscount)
      ? Math.min(Math.max(parsedDiscount, 0), 90) / 100
      : 0;

    addProduct({
      name: form.name || "새 상품",
      summary: form.summary,
      category: form.category,
      price,
      discountRate,
      sizes: form.sizes,
      thumbnail,
    });

    navigate("/admin/products");
  };

  return (
    <div>
      <SectionTitle>상품 등록</SectionTitle>
      <Description>이미지 업로드, 기본 정보 입력 후 저장합니다.</Description>
      <Form onSubmit={handleSubmit}>
        <Field>
          <Label htmlFor="name">상품명</Label>
          <Input
            id="name"
            value={form.name}
            onChange={(e) => updateField("name", e.target.value)}
            placeholder="상품명을 입력하세요"
            required
          />
        </Field>
        <Field>
          <Label htmlFor="summary">소개</Label>
          <TextArea
            id="summary"
            value={form.summary}
            onChange={(e) => updateField("summary", e.target.value)}
            placeholder="간단한 상품 소개"
          />
        </Field>
        <Field>
          <Label htmlFor="price">가격</Label>
          <Input
            id="price"
            type="number"
            min="0"
            value={form.price}
            onChange={(e) => updateField("price", e.target.value)}
            placeholder="129000"
            required
          />
        </Field>
        <Field>
          <Label htmlFor="category">카테고리</Label>
          <Input
            id="category"
            value={form.category}
            onChange={(e) => updateField("category", e.target.value)}
            placeholder="라이프스타일 / 슬립온"
            required
          />
        </Field>
        <Field>
          <Label htmlFor="sizes">사이즈</Label>
          <ChipList>
            {form.sizes.map((size) => (
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
          <Helper>+ 버튼으로 사이즈를 추가하고, X로 개별 제거하세요.</Helper>
        </Field>
        <Field>
          <Label htmlFor="discount">할인율 (%)</Label>
          <Input
            id="discount"
            type="number"
            min="0"
            max="90"
            value={form.discountRate}
            onChange={(e) => updateField("discountRate", e.target.value)}
            placeholder="0"
          />
          <Helper>0~90 사이 퍼센트 값으로 입력하세요.</Helper>
        </Field>
        <Field>
          <Label htmlFor="image">이미지 업로드</Label>
          <Input
            id="image"
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
          />
          <Helper>업로드한 이미지는 브라우저 URL로 즉시 미리보기됩니다.</Helper>
        </Field>

        <Submit type="submit">등록하기</Submit>
      </Form>

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
              <PrimaryButton type="button" onClick={handleAddSize}>
                추가
              </PrimaryButton>
            </PopActions>
          </PopCard>
        </PopOverlay>
      )}
    </div>
  );
}
