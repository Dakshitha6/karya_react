export const getSeverityByStage = (status?: string): string => {
  switch (status) {
    case 'notInitiated':
      return 'danger';
    case 'attempt1':
    case 'attempt2':
    case 'attempt3':
      return 'warning';
    case 'detailsCollected':
      return 'secondary';
    case 'resumeCreated':
      return 'info';
    case 'mailSent':
      return 'success';
    default:
      return 'secondary';
  }
};

export const getSeverityByStatus = (status?: string): string => {
  switch (status) {
    case 'open':
      return 'info';
    case 'completed':
      return 'success';
    case 'cancelled':
      return 'danger';
    default:
      return 'secondary';
  }
};

export const formatStage = (stage?: string): string => {
  const stageMap: Record<string, string> = {
    notInitiated: 'Not Initiated',
    attempt1: 'First Attempt',
    attempt2: 'Second Attempt',
    attempt3: 'Third Attempt',
    detailsCollected: 'Details Collected',
    resumeCreated: 'Resume Created',
    mailSent: 'Mail Sent',
  };
  return stageMap[stage || ''] || stage || '-';
};


