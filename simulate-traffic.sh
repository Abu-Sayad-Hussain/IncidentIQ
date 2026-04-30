#!/bin/bash

echo "🚀 Simulating IncidentIQ Traffic Spike..."

SERVICES=("auth-service" "payment-service" "inventory-db" "user-gateway" "billing-service")

for i in {1..40}; do
  # Pick random service
  SERVICE=${SERVICES[$RANDOM % 5]}
  
  # Weighted Random Level Generation (Mostly INFO, some WARN, rare ERROR)
  RAND_VAL=$((RANDOM % 100))
  
  if [ $RAND_VAL -gt 85 ]; then
    LEVEL="ERROR"
    MESSAGE="Connection timeout threshold exceeded during read"
  elif [ $RAND_VAL -gt 60 ]; then
    LEVEL="WARN"
    MESSAGE="API rate limit approaching 90% capacity"
  else
    LEVEL="INFO"
    MESSAGE="Successfully handled downstream request"
  fi

  # Every 15th request, force a CRITICAL event
  if [ $((i % 15)) -eq 0 ]; then
    LEVEL="CRITICAL"
    MESSAGE="FATAL: OOM Killed - Out of Memory Exception"
  fi

  curl -s -X POST http://localhost:3000/api/logs \
    -H "Content-Type: application/json" \
    -d "{
      \"serviceName\": \"$SERVICE\",
      \"level\": \"$LEVEL\",
      \"message\": \"$MESSAGE\",
      \"timestamp\": \"$(date -u +"%Y-%m-%dT%H:%M:%SZ")\"
    }" > /dev/null

  echo "Sent: [$LEVEL] $SERVICE - $MESSAGE"
  
  # Sleep for a fraction of a second to create a visible data stream
  sleep 0.3
done

echo "🏁 Traffic simulation complete!"
