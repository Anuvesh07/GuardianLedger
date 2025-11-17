'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Recommendation } from '@/lib/types';
import { AlertCircle, Info, Lightbulb } from 'lucide-react';
import { motion } from 'framer-motion';

interface RecommendationsPanelProps {
  recommendations: Recommendation[];
}

export default function RecommendationsPanel({ recommendations }: RecommendationsPanelProps) {
  const getIcon = (type: Recommendation['type']) => {
    switch (type) {
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-orange-600" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-600" />;
      case 'tip':
        return <Lightbulb className="h-5 w-5 text-green-600" />;
    }
  };

  const getColor = (type: Recommendation['type']) => {
    switch (type) {
      case 'warning':
        return 'bg-orange-50 dark:bg-orange-950 border-orange-200 dark:border-orange-800';
      case 'info':
        return 'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800';
      case 'tip':
        return 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Insights & Recommendations</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {recommendations.map((rec, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`p-4 rounded-lg border ${getColor(rec.type)}`}
          >
            <div className="flex gap-3">
              {getIcon(rec.type)}
              <p className="text-sm">{rec.message}</p>
            </div>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
}
