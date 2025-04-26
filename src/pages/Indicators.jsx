import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

try {
    await fetchIndicatorData;
    return IndicatorData;
  } catch (error) {
    setError(
      error.response?.data?.message ||
      error.message ||
      'Data fetch failed. Please try again.');
  }

export default IndicatorsPage;