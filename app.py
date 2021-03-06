# from flask import Flask

# app = Flask(__name__)

# @app.route("/6900")
# def hello():
#     return "Hello World"

# if __name__=='__main__':
#     app.run()

# import sklearn_json as skljson
import tempfile
import matplotlib.pyplot as plt
import numpy as np
import pprint

from sklearn.datasets import load_iris
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import MinMaxScaler
from sklearn.tree import DecisionTreeClassifier, plot_tree, export_text
x="something"

class node:
    def __init__(self):
        self.name = 'node'
        self.number = 0
        self.left = None
        self.right = None

class nodes:
    def __init__(self):
        self.nodeList = 'node'
        self.left = None
        self.right = None


class treeDataMaker():
    data = load_iris()

    def __init__(self, **kwargs):
        self.forestOfTrees = list()
        self.scaled_data = self.scale_data()
        self.clf = self.build_clf(**kwargs)
        self.tree_grabber()

    def build_clf(self,**kwargs) :
        clf = RandomForestClassifier()
        clf.set_params(**kwargs)
        clf.fit(self.data.data, self.data.target)
        return clf

    @classmethod
    def scale_data(cls):
        scale = MinMaxScaler()
        d = scale.fit_transform(cls.data.data)
        return d

    @classmethod
    def plot_clf_tree(cls, tree):
        plt.figure(figsize=(7.5,9.5))
        ax = plt.subplot()
        plot_tree(tree, filled=True,feature_names = cls.data.feature_names, ax = ax)
        plt.show()

    def tree_grabber(self):
        for tree in self.clf.estimators_:

            treeDict = self.export_tree_dict(tree)
            self.forestOfTrees.append(treeDict)
            treeRules = self.get_rule_matrix(tree)
            # self.plot_clf_tree(tree)
            print(treeRules.shape)
        unionTree = self.find_tree_union()
            
    def find_tree_union(self):
        for tree in self.clf:
            print("#"*30)
            for key, val in tree.items():
                print(key,val)
                if type(val)==list:
                    print("list here")
            print()
            print("#"*30)
        return True
    
    def export_tree_dict(self, tree):
        def tree_nodes_traverse(tree):
            tree_nodes = []
            treeCore = tree.tree_


            for i in range(treeCore.node_count):

                if (treeCore.children_left[i] == treeCore.children_right[i]):
                    #Its a leaf node
                    tree_nodes.append({"name":"leaf"})
                    
                else:
                    tree_nodes.append({
                        "name": self.data.feature_names[treeCore.feature[i]],
                        "left": treeCore.children_left[i],
                        "right": treeCore.children_right[i],
                    })
            return tree_nodes

        tree_nodes = tree_nodes_traverse(tree)
        for node in tree_nodes:
            print(node)
            if node["name"]!="leaf":
                node["children"] = list()
                node["children"].append(tree_nodes[node["left"]])
                node["children"].append(tree_nodes[node["right"]])
        pprint.pprint(tree_nodes[0])

        return  tree_nodes[0]

    def get_rule_matrix(self,tree):
        treeCore = tree.tree_
        ruleMatrix = np.array(treeCore.decision_path(self.data.data.astype("float32")).todense()).astype("int")
        return ruleMatrix

def export_links():
    # Need to write a function to export n links from each tree
    return True

def export_matrix():
    # Create a matrix that holds data and links
    return True


if __name__=='__main__':
    tree = treeDataMaker(n_estimators = 2, max_depth=2, random_state=7683)

#dcbxzygayqeb


# ruleJson = {}
# for i in range(1,9):
#     ruleJson[i-1] = ruleMatrix[:,i].flatten().tolist()

# dataJson = {}
# for i,name in enumerate(data.feature_names):
#     dataJson[str(name)] = list(d[:,i].flatten())

# import json
# print(ruleJson)
# with open("dataJson.json", "w") as jsData:
#     jsonString = json.dumps(dataJson)
#     jsData.writelines(jsonString)

# with open("ruleJson.json", "w") as jsData:
#     jsonString = json.dumps(ruleJson)
#     jsData.writelines(jsonString)






#########################################
##############Extras###################
#####################################
    # clf = DecisionTreeClassifier()
# iris = load_iris()
# clf = clf.fit(iris.data, iris.target)
# out_file = export_text(clf)

#js= skljson.to_json(clf,"s")

#out_file = export_json(clf, out_file=tempfile.TemporaryFile())
#out_file.close()11111111
