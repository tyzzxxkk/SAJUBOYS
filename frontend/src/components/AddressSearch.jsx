import { useState, useMemo, useRef, useEffect } from 'react';
import styled from 'styled-components';
import debounce from 'lodash/debounce';
import { sajuAPI } from '../services/api';

const Container = styled.div`
  position: relative;
  width: 100%;
`;

const InputContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.9rem 2.5rem 0.9rem 1.5rem;
  height: 3.2rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  font-size: 0.9rem;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
  color: white;
  cursor: pointer;
  box-sizing: border-box;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    background: rgba(255, 255, 255, 0.12);
    border-color: rgba(180, 140, 230, 0.6);
    box-shadow: 0 0 25px rgba(150, 100, 200, 0.4);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }

  @media (min-width: 769px) {
    height: 3.5rem;
    padding: 1rem 2.5rem 1rem 1.8rem;
    font-size: 0.95rem;
  }
`;

const SearchIcon = styled.svg`
  position: absolute;
  right: 12px;
  width: 20px;
  height: 20px;
  fill: rgba(255, 255, 255, 0.5);
  pointer-events: none;
`;

const ResultsList = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 8px;
  padding: 0;
  background: rgba(20, 20, 20, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
  max-height: 300px;
  overflow-y: auto;
  z-index: 1000;
  list-style: none;
`;

const ResultItem = styled.li`
  padding: 14px 16px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgba(200, 160, 255, 0.2);
  }

  &:not(:last-child) {
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }
`;

const PlaceName = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 4px;
`;

const NoResults = styled.div`
  padding: 20px;
  text-align: center;
  color: rgba(255, 255, 255, 0.5);
  font-size: 14px;
`;

const LoadingSpinner = styled.div`
  padding: 20px;
  text-align: center;
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
`;

const AddressSearch = ({
  value,
  onChange,
  placeholder = '주소를 입력하세요',
}) => {
  const [query, setQuery] = useState(value || '');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const containerRef = useRef(null);

  // 주소 검색 API 요청을 디바운스하여 불필요한 호출을 줄인다
  const debouncedSearch = useMemo(
    () =>
      debounce(async (searchQuery) => {
        if (!searchQuery || searchQuery.length < 2) {
          setResults([]);
          return;
        }

        setIsLoading(true);
        try {
          // 공통 API 클라이언트는 인증 헤더 처리와 에러 포맷을 일관화한다
          const response = await sajuAPI.searchAddress(searchQuery);
          setResults(response.data || []);
          setShowResults(true);
        } catch {
          setResults([]);
          setShowResults(true);
        } finally {
          setIsLoading(false);
        }
      }, 300),
    []
  );

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setQuery(newValue);
    debouncedSearch(newValue);
  };

  const handleSelectAddress = (address) => {
    const displayText = address.placeName || address.address;
    setQuery(displayText);
    onChange(displayText);
    setShowResults(false);
  };

  useEffect(() => {
    // 입력창 밖을 클릭하면 검색 결과 패널을 닫는다
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setQuery(value || '');
  }, [value]);

  return (
    <Container ref={containerRef}>
      <InputContainer>
        <Input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => results.length > 0 && setShowResults(true)}
          placeholder={placeholder}
        />
        <SearchIcon viewBox="0 0 24 24">
          <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
        </SearchIcon>
      </InputContainer>

      {showResults && (
        <ResultsList>
          {isLoading ? (
            <LoadingSpinner>검색 중...</LoadingSpinner>
          ) : results.length > 0 ? (
            results.map((address, index) => (
              <ResultItem
                key={index}
                onClick={() => handleSelectAddress(address)}
              >
                <PlaceName>{address.placeName}</PlaceName>
              </ResultItem>
            ))
          ) : query.length >= 2 ? (
            <NoResults>검색 결과가 없습니다</NoResults>
          ) : null}
        </ResultsList>
      )}
    </Container>
  );
};

export default AddressSearch;
