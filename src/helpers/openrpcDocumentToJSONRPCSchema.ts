import {
  MethodObject,
  ContentDescriptorObject,
  OpenrpcDocument,
  ExampleObject,
} from '@open-rpc/meta-schema';

const schema: any = {
  type: 'object',
  properties: {
    jsonrpc: {
      type: 'string',
      enum: ['2.0'],
      description: 'JSON-RPC version string',
    },
    id: {
      description: 'unique identifier for the JSON-RPC request',
      oneOf: [
        {
          type: 'string',
        },
        {
          type: 'number',
        },
      ],
    },
    method: {
      type: 'string',
    },
  },
};

const openrpcDocumentToJSONRPCSchema = (openrpcDocument: OpenrpcDocument) => {
  return {
    type: 'object',
    properties: {
      id: {
        ...schema.properties.id,
      },
      jsonrpc: {
        ...schema.properties.jsonrpc,
      },
      method: {
        type: 'string',
        oneOf: openrpcDocument?.methods?.map(_method => {
          const method = _method as MethodObject;
          return {
            const: method.name,
            description: method.description || method.summary,
            markdownDescription: method.description || method.summary,
          };
        }),
      },
    },
    allOf: openrpcDocument?.methods?.map(_method => {
      const method = _method as MethodObject;
      return {
        if: {
          properties: {
            method: {
              const: method.name,
            },
          },
        },
        then: {
          properties: {
            params: {
              oneOf: [
                {
                  type: 'array',
                  minItems: method?.params?.filter(
                    (param: any) => param.required,
                  ).length,
                  maxItems: method?.params?.length,
                  defaultSnippets: method.examples
                    ? method.examples.map((example: any) => {
                        return {
                          label: example.name,
                          description: example.description || example.summary,
                          body: example.params?.map(
                            (ex: ExampleObject) => ex.value,
                          ),
                        };
                      })
                    : [],
                  items: method.params?.map((param: any) => {
                    return {
                      ...param.schema,
                      markdownDescription: param.description || param.summary,
                      description: param.description || param.summary,
                      additionalProperties: false,
                    };
                  }),
                },
                {
                  type: 'object',
                  properties:
                    method.params &&
                    (method.params as ContentDescriptorObject[]).reduce(
                      (memo: any, param: ContentDescriptorObject) => {
                        if (typeof param.schema === 'object') {
                          memo[param.name] = {
                            ...param.schema,
                            markdownDescription:
                              param.description || param.summary,
                            description: param.description || param.summary,
                            additionalProperties: false,
                          };
                        } else {
                          memo[param.name] = param.schema;
                        }
                        return memo;
                      },
                      {},
                    ),
                },
              ],
            },
          },
        },
      };
    }),
  };
};

export default openrpcDocumentToJSONRPCSchema;
